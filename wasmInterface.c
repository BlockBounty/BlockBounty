const int PAGE_SIZE = 65536;
char data[PAGE_SIZE];
int pushIndex = 0;

float stack[PAGE_SIZE / 4];
int stackIndex = 0;
int arrayIndex = 0;

float floatBuffer;
char charBuffer;

void reset() {
    pushIndex = 0;
    stackIndex = 0;
    arrayIndex = 0;
}

void pushFloat(float val)
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

void pushByte(int byte)
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
            }

            stack[stackIndex - 2] = opResult;

            stackIndex--;
            arrayIndex++;
        }
    }

    return stack[stackIndex - 1];
}

float getFitness()
{
    return postfix();
}

float getSteps()
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

void init(int seed)
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
