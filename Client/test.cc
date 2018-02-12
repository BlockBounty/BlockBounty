#include <iostream>
#include <string>
#include <stdio.h>
#include <cstring>
#include <sstream>
#include <cstdlib> 
#include <limits>

using namespace std;

const int pageSize = 65536;
char data[pageSize];
int pushIndex = 0;

float stack[pageSize / 4];
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


            if (opResult == std::numeric_limits<float>::infinity()) {
                opResult = std::numeric_limits<float>::max();
                cout << "Overflow detected. Losing precision due to float max" << endl;
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

const int intMin = -2147483648;
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

    return ((double)v - intMin) / ((double)-1 * intMin - intMin);
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

bool isNumber(string s) {
  return !s.empty() && s.find_first_not_of("0123456789.") == std::string::npos;
}

int main() {
   init(50);
   string input = "0.5611315280211833 0.7553357509351917 * 0.7451591359063352 0.7430720789881105 - / 0.12119659209049605 / 0.6756672429576687 0.08977407701026752 / * 0.7451591359063352 0.7430720789881105 - / 0.4454813633466044 - 0.8553666283537573 0.7725767764844023 + / 0.5088501148516387 0.0696185551685764 - 0.4332245088973097 0.18255492007770013 + / / 0.10272211710062495 0.6547910479357619 + 0.11484218707408655 0.949315011480504 - * 0.22784518870079418 0.7791208931393783 / 0.36432453576415336 0.9380204540048256 * + + / 0.7451591359063352 0.7430720789881105 - / 0.12119659209049605 / 0.6756672429576687 0.08977407701026752 / * 0.7451591359063352 0.7430720789881105 - / 0.4454813633466044 - 0.8553666283537573 0.7725767764844023 + / 0.5088501148516387 0.0696185551685764 - 0.4332245088973097 0.18255492007770013 + / / 0.10272211710062495 0.6547910479357619 + 0.11484218707408655 0.949315011480504 - * 0.22784518870079418 0.7791208931393783 / 0.36432453576415336 0.9380204540048256 * + + / 0.7451591359063352 0.7430720789881105 - / 0.12119659209049605 / 0.6756672429576687 0.08977407701026752 / * 0.7451591359063352 0.7430720789881105 - / 0.4454813633466044 - 0.8553666283537573 0.7725767764844023 + / 0.5088501148516387 0.0696185551685764 - 0.4332245088973097 0.18255492007770013 + / / 0.10272211710062495 0.6547910479357619 + 0.11484218707408655 0.949315011480504 - * 0.22784518870079418 0.7791208931393783 / 0.36432453576415336 0.9380204540048256 * + + / 0.7553357509351917 * 0.7451591359063352 0.7430720789881105 - / 0.12119659209049605 / 0.6756672429576687 0.08977407701026752 / * 0.7451591359063352 0.7430720789881105 - / 0.4454813633466044 - 0.8553666283537573 0.7725767764844023 + / 0.5088501148516387 0.0696185551685764 - 0.4332245088973097 0.18255492007770013 + / / 0.10272211710062495 0.6547910479357619 + 0.11484218707408655 0.949315011480504 - * 0.22784518870079418 0.7791208931393783 / 0.36432453576415336 0.9380204540048256 * + + / 0.8379931842772688 0.3386094208408852 + 0.06548554676880958 0.2406915062043018 / + 0.09140189431767731 0.939008314582759 + 0.9815819136527506 0.2410765333597613 * / * 0.895183323355075 0.0023860554513046583 * 0.34540040106602676 0.7654060868054595 / - 0.7976627440546451 0.11961423402516513 + 0.5846549744753657 0.6314158290893714 * / * / + =";
  istringstream ss( input );
  while (!ss.eof()) {
    string x;
    getline(ss, x, ' ');
    if(isNumber(x)) {
      std::string::size_type sz; // alias of size_t
      float num = std::atof(x.c_str());
      pushFloat(num);
    } else {
      pushByte((int)x.c_str()[0]);
    }
}
cout << getFitness() << endl;

return 0;
}

