#define WASM_EXPORT __attribute__((visibility("default")))
#include <math.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct point {
    int x;
    int y;
} point;

float next();
void placeBerry();
bool isCollision(point moveResult);
bool isCollisionWithWall(point moveResult);
bool isCollisionWithSelf(point moveResult);

const int PAGE_SIZE = 65536;
char data[PAGE_SIZE];
int pushIndex = 0;

float stack[PAGE_SIZE / 4];
int stackIndex = 0;
int arrayIndex = 0;

float floatBuffer;
char charBuffer;

const int HEIGHT = 10;
const int WIDTH = 10;

point body[HEIGHT * WIDTH];
int headIndex;
int length;
point berry;

const point choices[4] = { {-1,0}, {0,-1}, {1,0}, {0,1} }; //West,North,East,South

point makeChoice(int choiceIndex) {
    point head = { body[headIndex].x + choices[choiceIndex].x, body[headIndex].y + choices[choiceIndex].y };
    return head;
}

void reset() {
    pushIndex = 0;
    stackIndex = 0;
    arrayIndex = 0;
}

void WASM_EXPORT pushFloat(float val)
{
    data[pushIndex++] = 'f';
    memcpy(data + pushIndex, &val, sizeof(float));
    pushIndex += 4;
}

float getFloat(int dataIndex)
{
    memcpy(&floatBuffer, data + dataIndex, sizeof floatBuffer);
    return floatBuffer;
}

void WASM_EXPORT pushByte(int byte)
{
    data[pushIndex] = (char)byte;
    pushIndex++;
}

int getByte(int dataIndex)
{
    memcpy(&charBuffer, data + (sizeof(char) * dataIndex), sizeof charBuffer);
    return charBuffer - 0;
}

float postfix()
{
    while (1)
    {
        int current = getByte(arrayIndex);
        if (current == 'f')
        {
            stack[stackIndex++] = getFloat(++arrayIndex);
            arrayIndex += 4;
        }
        else if (current == '=')
        {
            break;
        }
        else
        {
            float opResult;
            float n1 = stack[stackIndex - 2];
            float n2 = stack[stackIndex - 1];

            if (current == '*')
            {
                opResult = n1 * n2;
            }
            else if (current == '+')
            {
                opResult = n1 + n2;
            }
            else if (current == '-')
            {
                opResult = n1 - n2;
            }
            else if (current == '/')
            {
                opResult = n1 / n2;
            } else if (current == 'r')
            {
                opResult = next();
            }

            if (!isfinite(opResult)) {
                return next();
            }

            stack[stackIndex - 2] = opResult;

            stackIndex--;
            arrayIndex++;
        }
    }

    return stack[stackIndex - 1];
}

float WASM_EXPORT getFitness()
{
    float fitness = 0;
    point startingBody[3] = { {0,5}, {1,5}, {2,5} };
    memcpy(body, startingBody, sizeof(startingBody));
    headIndex = 2;
    length = 3;
    while (true) {
        placeBerry();
        float controllerEvaluation = postfix();
        int percentChance = round(controllerEvaluation * 100);
        int choice = abs(percentChance % 4);
        point moveResult = makeChoice(choice);
        fitness++;
        if (moveResult.x == berry.x && moveResult.y == berry.y) {
            length++;
            headIndex++;
            body[headIndex].x = berry.x;
            body[headIndex].y = berry.y;
            fitness += 10;
        } else if (isCollision(moveResult)) {
            return fitness;
        } else {
            headIndex = (headIndex + 1) % length;
            body[headIndex].x = moveResult.x;
            body[headIndex].y = moveResult.y;
        }
    }
}

bool isCollision(point moveResult) {
    return isCollisionWithWall(moveResult) || isCollisionWithSelf(moveResult);
}

bool isCollisionWithWall(point moveResult) {
    return moveResult.x <= 0 || moveResult.x >= WIDTH - 1 || moveResult.y <= 0 || moveResult.y >= HEIGHT - 1;
}

bool isCollisionWithSelf(point moveResult){
    bool foundCollision = false;
    for (int i = 0; i < length; i++) {
        if (body[i].x == moveResult.x && body[i].y == moveResult.y) {
            foundCollision = true;
        }
    }
    return foundCollision;
}

void placeBerry() {
    berry.x = floor(abs(next() * WIDTH));
    berry.y = floor(abs(next() * HEIGHT));
}

float WASM_EXPORT getSteps()
{
    return 1.0;
}

// A C implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf
// Note: This is not compatible with the JS implementation due to
// its alternative implementation of the left-shift operator '>>'

const int INT_MIN = -2147483648;
int X[8];
int i = 0;

float next()
{
    int t, v, w;

    t = X[i];
    t ^= (t >> 7);
    v = t ^ (t << 24);
    t = X[(i + 1) & 7];
    v ^= t ^ (t >> 10);
    t = X[(i + 3) & 7];
    v ^= t ^ (t >> 3);
    t = X[(i + 4) & 7];
    v ^= t ^ (t << 7);
    t = X[(i + 7) & 7];
    t = t ^ (t << 13);
    v ^= t ^ (t << 9);
    X[i] = v;
    i = (i + 1) & 7;

    return ((double)v - INT_MIN) / ((double)-1 * INT_MIN - INT_MIN);
}

void WASM_EXPORT init(int seed)
{
    reset();
    i = 0;
    for (int r = 0; r < 8; r++)
    {
        X[r] = 0;
    }

    int j = 0;
    int w = X[0] = seed;

    for (int k = 1; k < 8; k++)
        X[k] = 0;
    for (j = 0; j < 8 && X[j] == 0; ++j)
        ;
    if (j == 8)
        w = X[7] = -1;
    else
        w = X[j];

    for (j = 256; j > 0; --j)
    {
        next();
    }
}
