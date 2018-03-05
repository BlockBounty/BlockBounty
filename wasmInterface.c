#define WASM_EXPORT __attribute__((visibility("default")))
#include <math.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>

float function_west_collision_distance(void);
float function_north_collision_distance(void);
float function_east_collision_distance(void);
float function_south_collision_distance(void);
extern void console_log(int code);

const static struct
{
  const char *name;
  float (*func)(void);
} function_map[] = {
    {"w", function_west_collision_distance},
    {"n", function_north_collision_distance},
    {"e", function_east_collision_distance},
    {"s", function_south_collision_distance},
};

typedef struct point
{
    int x;
    int y;
} point;

float next();
void placeBerry();
bool isCollision(point moveResult);
bool isCollisionWithWall(point moveResult);
bool isCollisionWithSelf(point moveResult);
bool berryIsInBody();

const int MY_PAGE_SIZE = 65536;
char data[MY_PAGE_SIZE];
int pushIndex = 0;

float stack[MY_PAGE_SIZE / 4];
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
point choice;

const point choices[4] = {{-1, 0}, {0, -1}, {1, 0}, {0, 1}}; //West,North,East,South

point makeChoice(int choiceIndex)
{
    choice.x = body[headIndex].x + choices[choiceIndex].x;
    choice.y = body[headIndex].y + choices[choiceIndex].y;
    return choice;
}

void reset()
{
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
        else if (current != '*' && current != '+' && current != '-' && current != '/')
        {
            for (int i = 0; i < (sizeof(function_map) / sizeof(function_map[0])); i++)
            {
                if (!strcmp(function_map[i].name, (char *)&current) && function_map[i].func)
                {
                    stack[stackIndex] = function_map[i].func();
                    stackIndex++;
                    arrayIndex++;
                }
            }
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
            }

            if (!isfinite(opResult))
            {
                return next();
            }

            stack[stackIndex - 2] = opResult;

            stackIndex--;
            arrayIndex++;
        }
    }

    return stack[stackIndex - 1];
}

float steps = 0;
float WASM_EXPORT getFitness()
{
    float fitness = 0;
    steps = 0;
    point startingBody[3] = {{0, 5}, {1, 5}, {2, 5}};
    memcpy(body, startingBody, sizeof(startingBody));
    headIndex = 2;
    length = 3;
    while (true) {
        placeBerry();
    while (true)
    {
        steps++;
        float controllerEvaluation = postfix();
        int percentChance = round(controllerEvaluation * 100);
        int choice = abs(percentChance % 4);
        point moveResult = makeChoice(choice);
        if (moveResult.x == berry.x && moveResult.y == berry.y)
        {
            length++;
            headIndex++;
            body[headIndex].x = berry.x;
            body[headIndex].y = berry.y;
            fitness += 10;
        }
        else if (isCollision(moveResult))
        {
            return fitness;
        }

        fitness++;
            headIndex = (headIndex + 1) % length;
            body[headIndex].x = moveResult.x;
            body[headIndex].y = moveResult.y;
        }
    }
}

bool isCollision(point moveResult)
{
    return isCollisionWithWall(moveResult) || isCollisionWithSelf(moveResult);
}

bool isCollisionWithWall(point moveResult)
{
    return moveResult.x < 0 || moveResult.x > WIDTH - 1 || moveResult.y < 0 || moveResult.y > HEIGHT - 1;
}

bool isCollisionWithSelf(point moveResult)
{
    bool foundCollision = false;
    for (int i = 0; i < length; i++) {
        if (body[i].x == moveResult.x && body[i].y == moveResult.y) {
            foundCollision = true;
        }
    }
    return foundCollision;
}

void placeBerry()
{
    berry.x = floor(fabsf(next() * WIDTH));
    berry.y = floor(fabsf(next() * HEIGHT));
    if (berryIsInBody()) {
        placeBerry();
    }
}

bool berryIsInBody() {
    for (int i = 0; i < length; i++) {
        if (body[i].x == berry.x && body[i].y == berry.y) {
            return true;
        }
    }
    return false;
}

float function_west_collision_distance(void)
{
    int closestThreat = -1;
    point head = body[headIndex];
    for (int i = 0; i < length; i++) {
        if (body[i].y == head.y) {
            if (body[i].x < head.x && body[i].x > closestThreat) {
                closestThreat = head.x - body[i].x;
            }
        }
    }
    if (closestThreat == -1)
    {
        closestThreat = head.x + 1;
    }
    return 0.0 + (closestThreat + 1);
}

float function_north_collision_distance(void)
{
    int closestThreat = -1;
    point head = body[headIndex];
    for (int i = 0; i < length; i++) {
        if (body[i].x == head.x) {
            if (body[i].y < head.y && body[i].y > closestThreat) {
                closestThreat = head.y - body[i].y;
            }
        }
    }
    if (closestThreat == -1)
    {
        closestThreat = head.y + 1;
    }
    return 0.0 + (closestThreat + 1);
}

float function_east_collision_distance(void)
{
    int closestThreat = INT_MAX;
    point head = body[headIndex];
    for (int i = 0; i < length; i++) {
        if (body[i].y == head.y) {
            if (body[i].x > head.x && body[i].x < closestThreat) {
                closestThreat = body[i].x - head.x;
            }
        }
    }
    if (closestThreat == INT_MAX)
    {
        closestThreat = WIDTH - head.x;
    }
    return 0.0 + (closestThreat + 1);
}

float function_south_collision_distance(void)
{
    int closestThreat = INT_MAX;
    point head = body[headIndex];
    for (int i = 0; i < length; i++) {
        if (body[i].x == head.x) {
            if (body[i].y > head.y && body[i].y < closestThreat) {
                closestThreat = body[i].y - head.y;
            }
        }
    }
    if (closestThreat == INT_MAX)
    {
        closestThreat = HEIGHT - head.y;
    }
    return 0.0 + (closestThreat + 1);
}

float WASM_EXPORT getSteps()
{
    return steps;
}

// A C implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf
// Note: This is not compatible with the JS implementation due to
// its alternative implementation of the left-shift operator '>>'

// const int INT_MIN = -2147483648;
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
