export const problems = {
  output: [
    {
      id: 'o1',
      title: 'Hello, World! 출력하기',
      description: 'C언어의 가장 기본인 Hello, World!를 출력해보겠습니다.',
      input: '',
      output: 'Hello, World!',
      code: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
      hint: 'printf 함수는 stdio.h 헤더파일에 포함되어 있습니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}'
    },
    {
      id: 'o2',
      title: 'Hello, World! 여러 번 출력하기',
      description: 'printf를 사용하여 여러 줄로 출력해보겠습니다.',
      input: '',
      output: 'Hello,\nWorld!',
      code: `#include <stdio.h>

int main() {
    printf("Hello,\\n");
    printf("World!");
    return 0;
}`,
      hint: '\\n은 줄바꿈을 의미합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    printf("Hello,\\n");\n    printf("World!");\n    return 0;\n}'
    },
    {
      id: 'o3',
      title: '스페셜 문자 출력하기',
      description: '큰따옴표(")와 역슬래시(\\)를 포함한 문장을 출력해보자.',
      input: '',
      output: '"Hello \\ World!"',
      code: `#include <stdio.h>

int main() {
    printf("\\"Hello \\\\ World!\\"");
    return 0;
}`,
      hint: '큰따옴표는 \\", 역슬래시는 \\\\로 출력합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    printf("\\"Hello \\\\ World!\\"");\n    return 0;\n}'
    }
  ],
  inputOperator: [
    {
      id: 'io1',
      title: '정수 1개 입력받아 그대로 출력하기',
      description: '정수형(int)으로 변수를 선언하고, 입력받은 정수값을 그대로 출력해보자.',
      input: '15',
      output: '15',
      code: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%d", n);
    return 0;
}`,
      hint: 'scanf에서 &는 변수의 주소를 의미합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%d", n);\n    return 0;\n}'
    },
    {
      id: 'io2',
      title: '문자 1개 입력받아 그대로 출력하기',
      description: '문자형(char)으로 변수를 선언하고, 입력받은 문자를 그대로 출력해보자.',
      input: 'a',
      output: 'a',
      code: `#include <stdio.h>

int main() {
    char c;
    scanf("%c", &c);
    printf("%c", c);
    return 0;
}`,
      hint: '%c는 문자형(char) 변수를 출력하는 서식 문자입니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    char c;\n    scanf("%c", &c);\n    printf("%c", c);\n    return 0;\n}'
    },
    {
      id: 'io3',
      title: '실수 1개 입력받아 그대로 출력하기',
      description: '실수형(float)으로 변수를 선언하고, 입력받은 실수를 그대로 출력해보자.',
      input: '1.5',
      output: '1.5',
      code: `#include <stdio.h>

int main() {
    float f;
    scanf("%f", &f);
    printf("%f", f);
    return 0;
}`,
      hint: '%f는 실수형(float) 변수를 출력하는 서식 문자입니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    float f;\n    scanf("%f", &f);\n    printf("%f", f);\n    return 0;\n}'
    },
    {
      id: 'io4',
      title: '정수 2개 입력받아 그대로 출력하기',
      description: '공백으로 구분된 정수 2개를 입력받아 그대로 출력해보자.',
      input: '1 2',
      output: '1 2',
      code: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d %d", a, b);
    return 0;
}`,
      hint: 'scanf에서 여러 값은 공백으로 구분하여 입력합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d %d", a, b);\n    return 0;\n}'
    },
    {
      id: 'io5',
      title: '문자 2개 입력받아 순서 바꿔 출력하기',
      description: '문자 2개를 입력받고, 순서를 바꿔서 출력해보자.',
      input: 'a b',
      output: 'b a',
      code: `#include <stdio.h>

int main() {
    char a, b;
    scanf("%c %c", &a, &b);
    printf("%c %c", b, a);
    return 0;
}`,
      hint: '입력 시 %c 사이에 공백을 포함시켜야 합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    char a, b;\n    scanf("%c %c", &a, &b);\n    printf("%c %c", b, a);\n    return 0;\n}'
    },
    {
      id: 'io6',
      title: '실수 입력받아 둘째 자리까지 출력하기',
      description: '실수를 입력받아 소수점 이하 둘째 자리까지 출력해보자.',
      input: '1.567',
      output: '1.57',
      code: `#include <stdio.h>

int main() {
    double d;
    scanf("%lf", &d);
    printf("%.2f", d);
    return 0;
}`,
      hint: '%.2f는 소수점 이하 둘째 자리까지 출력합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    double d;\n    scanf("%lf", &d);\n    printf("%.2f", d);\n    return 0;\n}'
    },
    {
      id: 'io7',
      title: '정수 2개 입력받아 합 출력하기',
      description: '정수 2개를 입력받아 합을 출력해보자.',
      input: '123 -123',
      output: '0',
      code: `#include <stdio.h>

int main() {
    long long a, b;
    scanf("%lld %lld", &a, &b);
    printf("%lld", a + b);
    return 0;
}`,
      hint: 'int 범위를 초과할 수 있으므로 long long형을 사용하세요.',
      answer: '#include <stdio.h>\n\nint main() {\n    long long a, b;\n    scanf("%lld %lld", &a, &b);\n    printf("%lld", a + b);\n    return 0;\n}'
    },
    {
      id: 'io8',
      title: '정수 1개 입력받아 부호 바꿔 출력하기',
      description: '입력받은 정수의 부호를 바꿔서 출력해보자.',
      input: '10',
      output: '-10',
      code: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%d", -n);
    return 0;
}`,
      hint: '음수를 표현할 때 -를 앞에 붙이면 됩니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%d", -n);\n    return 0;\n}'
    },
    {
      id: 'io9',
      title: '문자 1개 입력받아 다음 문자 출력하기',
      description: '영문자를 입력받아 그 다음 문자를 출력해보자.',
      input: 'a',
      output: 'b',
      code: `#include <stdio.h>

int main() {
    char c;
    scanf("%c", &c);
    printf("%c", c + 1);
    return 0;
}`,
      hint: '문자도 내부적으로는 아스키 코드 값으로 처리됩니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    char c;\n    scanf("%c", &c);\n    printf("%c", c + 1);\n    return 0;\n}'
    },
    {
      id: 'io10',
      title: '정수 2개 입력받아 나눈 몫 출력하기',
      description: '두 정수를 입력받아 나눈 몫을 출력해보자.',
      input: '10 3',
      output: '3',
      code: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d", a / b);
    return 0;
}`,
      hint: '정수끼리 나눗셈의 결과는 정수(몫)입니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d", a / b);\n    return 0;\n}'
    },
    {
      id: 'io11',
      title: '정수 2개 입력받아 나눈 나머지 출력하기',
      description: '두 정수를 입력받아 나눗셈의 나머지를 출력해보자.',
      input: '10 3',
      output: '1',
      code: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d", a % b);
    return 0;
}`,
      hint: '% 연산자는 나눗셈의 나머지를 구합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d", a % b);\n    return 0;\n}'
    },
    {
      id: 'io12',
      title: '정수 2개 입력받아 자동 계산하기',
      description: '두 정수의 합, 차, 곱, 몫, 나머지, 나눈 값을 출력해보자.',
      input: '10 3',
      output: '13\n7\n30\n3\n1\n3.33',
      code: `#include <stdio.h>

int main() {
    long long a, b;
    scanf("%lld %lld", &a, &b);
    printf("%lld\\n", a + b);
    printf("%lld\\n", a - b);
    printf("%lld\\n", a * b);
    printf("%lld\\n", a / b);
    printf("%lld\\n", a % b);
    printf("%.2f", (double)a / b);
    return 0;
}`,
      hint: '나눈 값은 실수로 출력해야 정확한 결과를 얻습니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    long long a, b;\n    scanf("%lld %lld", &a, &b);\n    printf("%lld\\n", a + b);\n    printf("%lld\\n", a - b);\n    printf("%lld\\n", a * b);\n    printf("%lld\\n", a / b);\n    printf("%lld\\n", a % b);\n    printf("%.2f", (double)a / b);\n    return 0;\n}'
    },
    {
      id: 'io13',
      title: '정수 3개 입력받아 합과 평균 출력하기',
      description: '세 정수를 입력받아 합과 평균을 출력해보자.',
      input: '1 2 3',
      output: '6\n2.0',
      code: `#include <stdio.h>

int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    int sum = a + b + c;
    printf("%d\\n", sum);
    printf("%.1f", (double)sum / 3);
    return 0;
}`,
      hint: '평균은 실수로 계산해야 정확한 결과를 얻습니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int a, b, c;\n    scanf("%d %d %d", &a, &b, &c);\n    int sum = a + b + c;\n    printf("%d\\n", sum);\n    printf("%.1f", (double)sum / 3);\n    return 0;\n}'
    },
    {
      id: 'io14',
      title: '10진 정수를 8진수로 출력하기',
      description: '10진수 정수를 입력받아 8진수로 출력해보자.',
      input: '10',
      output: '12',
      code: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%o", n);
    return 0;
}`,
      hint: '%o는 8진수로 출력하는 서식 문자입니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%o", n);\n    return 0;\n}'
    },
    {
      id: 'io15',
      title: '10진 정수를 16진수로 출력하기',
      description: '10진수 정수를 입력받아 16진수로 출력해보자.',
      input: '255',
      output: 'ff',
      code: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%x", n);
    return 0;
}`,
      hint: '%x는 16진수(소문자)로 출력하는 서식 문자입니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%x", n);\n    return 0;\n}'
    },
    {
      id: 'io16',
      title: '정수를 아스키 문자로 출력하기',
      description: '아스키 코드 값을 입력받아 해당 문자를 출력해보자.',
      input: '65',
      output: 'A',
      code: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%c", n);
    return 0;
}`,
      hint: '%c를 사용하면 정수를 문자로 출력할 수 있습니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%c", n);\n    return 0;\n}'
    },
    {
      id: 'io17',
      title: '두 정수 입력받아 큰 수 출력하기',
      description: '두 정수를 입력받아 큰 수를 출력해보자. (삼항연산자 사용)',
      input: '3 5',
      output: '5',
      code: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d", a > b ? a : b);
    return 0;
}`,
      hint: '삼항연산자: 조건 ? 참일때값 : 거짓일때값',
      answer: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d", a > b ? a : b);\n    return 0;\n}'
    }
  ],
  conditional: [
    {
      id: 'c1',
      title: '두 정수의 덧셈',
      description: '두 정수를 입력받아 합을 출력해보자.',
      input: '1 2',
      output: '3',
      code: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d", a + b);
    return 0;
}`,
      hint: 'scanf로 두 값을 입력받고 더합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d", a + b);\n    return 0;\n}'
    },
    {
      id: 'c2',
      title: '사칙연산 계산기',
      description: '두 정수와 연산자를 입력받아 계산 결과를 출력해보자.',
      input: '3 + 5',
      output: '8',
      code: `#include <stdio.h>

int main() {
    int a, b;
    char op;
    scanf("%d %c %d", &a, &op, &b);

    if (op == '+') printf("%d", a + b);
    else if (op == '-') printf("%d", a - b);
    else if (op == '*') printf("%d", a * b);
    else if (op == '/') printf("%d", a / b);

    return 0;
}`,
      hint: '문자 비교는 == 를 사용합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    char op;\n    scanf("%d %c %d", &a, &op, &b);\n\n    if (op == \'+\') printf("%d", a + b);\n    else if (op == \'-\') printf("%d", a - b);\n    else if (op == \'*\') printf("%d", a * b);\n    else if (op == \'/\') printf("%d", a / b);\n\n    return 0;\n}'
    },
    {
      id: 'c3',
      title: '삼각형의 넓이 구하기',
      description: '밑변과 높이를 입력받아 삼각형의 넓이를 출력해보자.',
      input: '5 4',
      output: '10.00',
      code: `#include <stdio.h>

int main() {
    double base, height;
    scanf("%lf %lf", &base, &height);
    printf("%.2f", base * height / 2);
    return 0;
}`,
      hint: '삼각형 넓이 = (밑변 × 높이) / 2',
      answer: '#include <stdio.h>\n\nint main() {\n    double base, height;\n    scanf("%lf %lf", &base, &height);\n    printf("%.2f", base * height / 2);\n    return 0;\n}'
    },
    {
      id: 'c4',
      title: '세 수의 평균',
      description: '세 실수를 입력받아 평균을 출력해보자.',
      input: '1.0 2.0 3.0',
      output: '2.0',
      code: `#include <stdio.h>

int main() {
    double a, b, c;
    scanf("%lf %lf %lf", &a, &b, &c);
    printf("%.1f", (a + b + c) / 3);
    return 0;
}`,
      hint: '평균은 세 수의 합을 3으로 나눈 값입니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    double a, b, c;\n    scanf("%lf %lf %lf", &a, &b, &c);\n    printf("%.1f", (a + b + c) / 3);\n    return 0;\n}'
    },
    {
      id: 'c5',
      title: '섭씨 온도를 화씨 온도로 변환',
      description: '섭씨 온도를 화씨 온도로 변환하여 출력해보자.',
      input: '0',
      output: '32.0',
      code: `#include <stdio.h>

int main() {
    double c;
    scanf("%lf", &c);
    double f = c * 9.0 / 5.0 + 32.0;
    printf("%.1f", f);
    return 0;
}`,
      hint: 'F = C × 9/5 + 32',
      answer: '#include <stdio.h>\n\nint main() {\n    double c;\n    scanf("%lf", &c);\n    double f = c * 9.0 / 5.0 + 32.0;\n    printf("%.1f", f);\n    return 0;\n}'
    },
    {
      id: 'c6',
      title: '10보다 작은 수',
      description: '정수 1개를 입력받아 10보다 작으면 "small"을 출력해보자.',
      input: '5',
      output: 'small',
      code: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    if (n < 10) {
        printf("small");
    }
    return 0;
}`,
      hint: 'if (조건식) { ... } 형태로 작성합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    if (n < 10) {\n        printf("small");\n    }\n    return 0;\n}'
    },
    {
      id: 'c7',
      title: '10보다 작은 수 (else)',
      description: '정수가 10보다 작으면 "small", 10 이상이면 "big"을 출력해보자.',
      input: '15',
      output: 'big',
      code: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    if (n < 10) {
        printf("small");
    } else {
        printf("big");
    }
    return 0;
}`,
      hint: 'if-else 구조를 사용합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    if (n < 10) {\n        printf("small");\n    } else {\n        printf("big");\n    }\n    return 0;\n}'
    }
  ],
  loop: [
    {
      id: 'l1',
      title: '1부터 5까지 출력하기',
      description: 'for문을 사용하여 1부터 5까지 출력해보자.',
      input: '',
      output: '1 2 3 4 5',
      code: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    return 0;
}`,
      hint: 'for문은 for(초기화; 조건; 증감)의 형태를 가집니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        printf("%d ", i);\n    }\n    return 0;\n}'
    },
    {
      id: 'l2',
      title: '5부터 1까지 역순 출력하기',
      description: 'while문을 사용하여 5부터 1까지 역순으로 출력해보자.',
      input: '',
      output: '5 4 3 2 1',
      code: `#include <stdio.h>

int main() {
    int i = 5;
    while (i >= 1) {
        printf("%d ", i);
        i--;
    }
    return 0;
}`,
      hint: 'while문 내부에서 조건에 영향을 주는 변수를 반드시 증감시켜야 합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int i = 5;\n    while (i >= 1) {\n        printf("%d ", i);\n        i--;\n    }\n    return 0;\n}'
    },
    {
      id: 'l3',
      title: '구구단 (2단)',
      description: 'for문을 사용하여 2단을 출력해보자.',
      input: '',
      output: '2*1=2\n2*2=4\n...\n2*9=18',
      code: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 9; i++) {
        printf("2*%d=%d\\n", i, 2 * i);
    }
    return 0;
}`,
      hint: '\\n은 줄바꿈을 의미합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 9; i++) {\n        printf("2*%d=%d\\n", i, 2 * i);\n    }\n    return 0;\n}'
    },
    {
      id: 'l4',
      title: '1부터 n까지의 합 구하기',
      description: '정수 n을 입력받아 1부터 n까지의 합을 구해보자.',
      input: '10',
      output: '55',
      code: `#include <stdio.h>

int main() {
    int n, sum = 0;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    printf("%d", sum);
    return 0;
}`,
      hint: 'sum += i는 sum = sum + i와 같습니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int n, sum = 0;\n    scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        sum += i;\n    }\n    printf("%d", sum);\n    return 0;\n}'
    },
    {
      id: 'l5',
      title: '짝수만 출력하기',
      description: '1부터 20까지의 짝수만 출력해보자.',
      input: '',
      output: '2 4 6 8 10 12 14 16 18 20',
      code: `#include <stdio.h>

int main() {
    for (int i = 2; i <= 20; i += 2) {
        printf("%d ", i);
    }
    return 0;
}`,
      hint: 'i += 2는 i = i + 2와 같습니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    for (int i = 2; i <= 20; i += 2) {\n        printf("%d ", i);\n    }\n    return 0;\n}'
    },
    {
      id: 'l6',
      title: '별 찍기 - 직각삼각형',
      description: 'n을 입력받아 아래와 같이 별을 찍어보자.',
      input: '5',
      output: '*\n**\n***\n****\n*****',
      code: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            printf("*");
        }
        printf("\\n");
    }
    return 0;
}`,
      hint: '이중 반복문을 사용합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= i; j++) {\n            printf("*");\n        }\n        printf("\\n");\n    }\n    return 0;\n}'
    },
    {
      id: 'l7',
      title: 'a부터 b까지 출력하기',
      description: '두 정수 a, b를 입력받아 a부터 b까지 순서대로 출력해보자. (a <= b)',
      input: '3 8',
      output: '3 4 5 6 7 8',
      code: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    for (int i = a; i <= b; i++) {
        printf("%d ", i);
    }
    return 0;
}`,
      hint: '반복문의 초기값을 a로, 조건식을 i <= b로 설정합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    for (int i = a; i <= b; i++) {\n        printf("%d ", i);\n    }\n    return 0;\n}'
    }
  ],
  array: [
    {
      id: 'a1',
      title: '배열의 합 구하기',
      description: '5개의 정수를 입력받아它们的 합을 구해보자.',
      input: '1 2 3 4 5',
      output: '15',
      code: `#include <stdio.h>

int main() {
    int arr[5], sum = 0;
    for (int i = 0; i < 5; i++) {
        scanf("%d", &arr[i]);
        sum += arr[i];
    }
    printf("%d", sum);
    return 0;
}`,
      hint: '배열의 인덱스는 0부터 시작합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int arr[5], sum = 0;\n    for (int i = 0; i < 5; i++) {\n        scanf("%d", &arr[i]);\n        sum += arr[i];\n    }\n    printf("%d", sum);\n    return 0;\n}'
    },
    {
      id: 'a2',
      title: '배열에서 최대값 찾기',
      description: '5개의 정수를 입력받아 최대값을 출력해보자.',
      input: '3 9 1 5 2',
      output: '9',
      code: `#include <stdio.h>

int main() {
    int arr[5], max;
    for (int i = 0; i < 5; i++) {
        scanf("%d", &arr[i]);
    }
    max = arr[0];
    for (int i = 1; i < 5; i++) {
        if (arr[i] > max) max = arr[i];
    }
    printf("%d", max);
    return 0;
}`,
      hint: '첫 번째 요소를 최대값으로 가정하고 비교합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int arr[5], max;\n    for (int i = 0; i < 5; i++) {\n        scanf("%d", &arr[i]);\n    }\n    max = arr[0];\n    for (int i = 1; i < 5; i++) {\n        if (arr[i] > max) max = arr[i];\n    }\n    printf("%d", max);\n    return 0;\n}'
    },
    {
      id: 'a3',
      title: '배열 뒤집기',
      description: '5개의 정수를 입력받아 역순으로 출력해보자.',
      input: '1 2 3 4 5',
      output: '5 4 3 2 1',
      code: `#include <stdio.h>

int main() {
    int arr[5];
    for (int i = 0; i < 5; i++) {
        scanf("%d", &arr[i]);
    }
    for (int i = 4; i >= 0; i--) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,
      hint: '반복문을 거꾸로 돌면 됩니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int arr[5];\n    for (int i = 0; i < 5; i++) {\n        scanf("%d", &arr[i]);\n    }\n    for (int i = 4; i >= 0; i--) {\n        printf("%d ", arr[i]);\n    }\n    return 0;\n}'
    },
    {
      id: 'a4',
      title: '2차원 배열의 행의 합',
      description: '3x3 행렬을 입력받아 각 행의 합을 출력해보자.',
      input: '1 2 3\n4 5 6\n7 8 9',
      output: '6\n15\n24',
      code: `#include <stdio.h>

int main() {
    int arr[3][3];
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            scanf("%d", &arr[i][j]);
        }
    }
    for (int i = 0; i < 3; i++) {
        int sum = 0;
        for (int j = 0; j < 3; j++) {
            sum += arr[i][j];
        }
        printf("%d\\n", sum);
    }
    return 0;
}`,
      hint: '이중 반복문으로 2차원 배열을 탐색합니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int arr[3][3];\n    for (int i = 0; i < 3; i++) {\n        for (int j = 0; j < 3; j++) {\n            scanf("%d", &arr[i][j]);\n        }\n    }\n    for (int i = 0; i < 3; i++) {\n        int sum = 0;\n        for (int j = 0; j < 3; j++) {\n            sum += arr[i][j];\n        }\n        printf("%d\\n", sum);\n    }\n    return 0;\n}'
    },
    {
      id: 'a5',
      title: '배열에서 특정 값의 개수 세기',
      description: '5개의 정수와 찾고자 하는 정수 k를 입력받아 k의 개수를 출력해보자.',
      input: '1 2 3 2 5\n2',
      output: '2',
      code: `#include <stdio.h>

int main() {
    int arr[5], k, count = 0;
    for (int i = 0; i < 5; i++) {
        scanf("%d", &arr[i]);
    }
    scanf("%d", &k);
    for (int i = 0; i < 5; i++) {
        if (arr[i] == k) count++;
    }
    printf("%d", count);
    return 0;
}`,
      hint: '배열을 순회하면서 조건에 맞는 요소를 발견하면 카운트를 증가시킵니다.',
      answer: '#include <stdio.h>\n\nint main() {\n    int arr[5], k, count = 0;\n    for (int i = 0; i < 5; i++) {\n        scanf("%d", &arr[i]);\n    }\n    scanf("%d", &k);\n    for (int i = 0; i < 5; i++) {\n        if (arr[i] == k) count++;\n    }\n    printf("%d", count);\n    return 0;\n}'
    }
  ],
  string: [
    {
      id: 's1',
      title: '문자열 길이 구하기',
      description: '문자열을 입력받고 길이를 출력해보자.',
      input: 'hello',
      output: '5',
      code: `#include <stdio.h>
#include <string.h>

int main() {
    char str[100];
    scanf("%s", str);
    printf("%lu", strlen(str));
    return 0;
}`,
      hint: 'string.h의 strlen 함수를 사용합니다.',
      answer: '#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[100];\n    scanf("%s", str);\n    printf("%lu", strlen(str));\n    return 0;\n}'
    },
    {
      id: 's2',
      title: '문자열 뒤집기',
      description: '문자열을 입력받고 뒤집어서 출력해보자.',
      input: 'hello',
      output: 'olleh',
      code: `#include <stdio.h>
#include <string.h>

int main() {
    char str[100];
    scanf("%s", str);
    int len = strlen(str);
    for (int i = len - 1; i >= 0; i--) {
        printf("%c", str[i]);
    }
    return 0;
}`,
      hint: '문자열의 끝에서부터 문자를 출력합니다.',
      answer: '#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[100];\n    scanf("%s", str);\n    int len = strlen(str);\n    for (int i = len - 1; i >= 0; i--) {\n        printf("%c", str[i]);\n    }\n    return 0;\n}'
    },
    {
      id: 's3',
      title: '문자열 비교하기',
      description: '두 문자열을 입력받아 사전순으로 비교해보자.',
      input: 'apple\nbanana',
      output: '-1',
      code: `#include <stdio.h>
#include <string.h>

int main() {
    char a[100], b[100];
    scanf("%s %s", a, b);
    printf("%d", strcmp(a, b));
    return 0;
}`,
      hint: 'strcmp는 두 문자열을 비교합니다 (a<b:음수, a==b:0, a>b:양수)',
      answer: '#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char a[100], b[100];\n    scanf("%s %s", a, b);\n    printf("%d", strcmp(a, b));\n    return 0;\n}'
    },
    {
      id: 's4',
      title: '알파벳 대문자로 변환하기',
      description: '소문자로 된 문자열을 입력받아 대문자로 변환하여 출력해보자.',
      input: 'paradox',
      output: 'PARADOX',
      code: `#include <stdio.h>
#include <string.h>

int main() {
    char str[100];
    scanf("%s", str);
    int len = strlen(str);
    for (int i = 0; i < len; i++) {
        if (str[i] >= 'a' && str[i] <= 'z') {
            str[i] = str[i] - 32;
        }
    }
    printf("%s", str);
    return 0;
}`,
      hint: '소문자와 대문자의 아스키 코드 차이는 32입니다 (\'a\' - \'A\' = 32).',
      answer: '#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[100];\n    scanf("%s", str);\n    int len = strlen(str);\n    for (int i = 0; i < len; i++) {\n        if (str[i] >= \'a\' && str[i] <= \'z\') {\n            str[i] = str[i] - 32;\n        }\n    }\n    printf("%s", str);\n    return 0;\n}'
    }
  ],
  function: [
    {
      id: 'f1',
      title: '두 수의 합을 구하는 함수',
      description: '두 정수를 더하는 함수를 정의하고 호출해보자.',
      input: '3 5',
      output: '8',
      code: `#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    printf("%d", add(x, y));
    return 0;
}`,
      hint: '함수는 main 함수 이전에 정의하거나 프로토타입을 선언할 수 있습니다.',
      answer: '#include <stdio.h>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int x, y;\n    scanf("%d %d", &x, &y);\n    printf("%d", add(x, y));\n    return 0;\n}'
    },
    {
      id: 'f2',
      title: '재귀함수로 팩토리얼 구하기',
      description: '재귀 함수를 사용하여 n!을 구해보자.',
      input: '5',
      output: '120',
      code: `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d", factorial(n));
    return 0;
}`,
      hint: '재귀함수는 자기 자신을 호출합니다.',
      answer: '#include <stdio.h>\n\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%d", factorial(n));\n    return 0;\n}'
    },
    {
      id: 'f3',
      title: '피보나치 수열',
      description: '재귀 함수를 사용하여 피보나치 수를 구해보자.',
      input: '10',
      output: '55',
      code: `#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d", fibonacci(n));
    return 0;
}`,
      hint: '피보나치: F(n) = F(n-1) + F(n-2), F(0)=0, F(1)=1',
      answer: '#include <stdio.h>\n\nint fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%d", fibonacci(n));\n    return 0;\n}'
    },
    {
      id: 'f4',
      title: '절대값을 구하는 함수',
      description: '정수를 입력받아 절대값을 반환하는 함수 abs_val을 작성해보자.',
      input: '-75',
      output: '75',
      code: `#include <stdio.h>

int abs_val(int n) {
    return n < 0 ? -n : n;
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d", abs_val(n));
    return 0;
}`,
      hint: '음수일 경우 -를 붙여 반환하고, 양수일 경우 그대로 반환합니다.',
      answer: '#include <stdio.h>\n\nint abs_val(int n) {\n    return n < 0 ? -n : n;\n}\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%d", abs_val(n));\n    return 0;\n}'
    }
  ],
  structure: [
    {
      id: 'st1',
      title: '구조체로 점수 관리',
      description: '구조체를 사용하여 학생의 이름과 점수를 저장하고 출력해보자.',
      input: '홍길동\n90',
      output: '홍길동: 90점',
      code: `#include <stdio.h>

struct Student {
    char name[20];
    int score;
};

int main() {
    struct Student s;
    scanf("%s %d", s.name, &s.score);
    printf("%s: %d점", s.name, s.score);
    return 0;
}`,
      hint: '구조체 멤버 접근은 점(.) 연산자를 사용합니다.',
      answer: '#include <stdio.h>\n\nstruct Student {\n    char name[20];\n    int score;\n};\n\nint main() {\n    struct Student s;\n    scanf("%s %d", s.name, &s.score);\n    printf("%s: %d점", s.name, s.score);\n    return 0;\n}'
    },
    {
      id: 'st2',
      title: '구조체로 좌표 관리',
      description: 'x, y 좌표를 구조체로 관리하고 두 점 사이의 거리를 구해보자.',
      input: '0 0\n3 4',
      output: '5.0',
      code: `#include <stdio.h>
#include <math.h>

struct Point {
    double x, y;
};

int main() {
    struct Point p1, p2;
    scanf("%lf %lf %lf %lf", &p1.x, &p1.y, &p2.x, &p2.y);
    double dist = sqrt(pow(p2.x - p1.x, 2) + pow(p2.y - p1.y, 2));
    printf("%.1f", dist);
    return 0;
}`,
      hint: '거리 공식: √((x2-x1)² + (y2-y1)²)',
      answer: '#include <stdio.h>\n#include <math.h>\n\nstruct Point {\n    double x, y;\n};\n\nint main() {\n    struct Point p1, p2;\n    scanf("%lf %lf %lf %lf", &p1.x, &p1.y, &p2.x, &p2.y);\n    double dist = sqrt(pow(p2.x - p1.x, 2) + pow(p2.y - p1.y, 2));\n    printf("%.1f", dist);\n    return 0;\n}'
    },
    {
      id: 'st3',
      title: '학생 정보 비교하기',
      description: '두 학생의 이름과 점수를 입력받아, 점수가 더 높은 학생의 이름을 출력해보자.',
      input: '철수 85 영희 92',
      output: '영희',
      code: `#include <stdio.h>

struct Student {
    char name[20];
    int score;
};

int main() {
    struct Student s1, s2;
    scanf("%s %d %s %d", s1.name, &s1.score, s2.name, &s2.score);
    if (s1.score > s2.score) {
        printf("%s", s1.name);
    } else {
        printf("%s", s2.name);
    }
    return 0;
}`,
      hint: '구조체 변수 여러 개를 각각 선언하고 사용합니다.',
      answer: '#include <stdio.h>\n\nstruct Student {\n    char name[20];\n    int score;\n};\n\nint main() {\n    struct Student s1, s2;\n    scanf("%s %d %s %d", s1.name, &s1.score, s2.name, &s2.score);\n    if (s1.score > s2.score) {\n        printf("%s", s1.name);\n    } else {\n        printf("%s", s2.name);\n    }\n    return 0;\n}'
    }
  ]
};

export const levelColors = {
  output: '#3498db',
  inputOperator: '#2ecc71',
  conditional: '#9b59b6',
  loop: '#f39c12',
  array: '#e74c3c',
  string: '#1abc9c',
  function: '#e67e22',
  structure: '#95a5a6'
};

const levelLabels = {
  output: '출력문',
  inputOperator: '입출력/연산자',
  conditional: '조건문',
  loop: '반복문',
  array: '배열',
  string: '문자열',
  function: '함수',
  structure: '구조체'
};

// 모든 문제를 하나의 배열로 가져오기
export function getAllProblems() {
  const all = [];
  for (const category of Object.keys(problems)) {
    for (const p of problems[category]) {
      all.push({ ...p, category });
    }
  }
  return all;
}

// 조건 비틀기: 기존 문제를 약간 더 어렵게 변형
const twistTemplates = [
  {
    // 반복 출력: 기존 출력 결과를 N번 반복
    match: (p) => p.category === 'output' || (p.output && !p.input),
    twist: (p) => {
      const n = Math.floor(Math.random() * 3) + 2;
      const repeatedOutput = Array(n).fill(p.output).join('\\n');
      return {
        ...p,
        id: `battle_${p.id}`,
        title: `🔥 ${p.title} (${n}번 반복)`,
        description: `${p.description}\n\n⚡ 배틀 조건: 위 결과를 ${n}번 반복하여 줄바꿈으로 구분하여 출력하세요.`,
        output: repeatedOutput,
        input: '',
        hint: `${p.hint} (for문을 사용하여 ${n}번 반복하세요)`,
        twisted: true,
        originalId: p.id,
        twistType: 'repeat',
        repeatCount: n
      };
    }
  },
  {
    // 입력값 범위 확장: 기존 입력/연산 문제에 범위 제한 추가
    match: (p) => p.category === 'inputOperator' && p.input,
    twist: (p) => {
      const variations = [
        {
          desc: '입력값이 음수인 경우 절대값으로 변환한 뒤 계산하세요.',
          twistType: 'absConvert',
          suffix: '(절대값 변환)'
        },
        {
          desc: '결과가 짝수이면 결과를, 홀수이면 결과+1을 출력하세요.',
          twistType: 'evenOdd',
          suffix: '(짝수 보정)'
        },
        {
          desc: '결과값 뒤에 줄바꿈 후 "done"이라고 출력하세요.',
          twistType: 'appendDone',
          suffix: '(완료 표시)'
        }
      ];
      const v = variations[Math.floor(Math.random() * variations.length)];
      return {
        ...p,
        id: `battle_${p.id}`,
        title: `🔥 ${p.title} ${v.suffix}`,
        description: `${p.description}\n\n⚡ 배틀 조건: ${v.desc}`,
        hint: `${p.hint} (추가 조건에 주의하세요)`,
        twisted: true,
        originalId: p.id,
        twistType: v.twistType
      };
    }
  },
  {
    // 조건문 강화: 추가 분기 조건
    match: (p) => p.category === 'conditional',
    twist: (p) => {
      return {
        ...p,
        id: `battle_${p.id}`,
        title: `🔥 ${p.title} (강화)`,
        description: `${p.description}\n\n⚡ 배틀 조건: 결과값이 0보다 작으면 "negative"를, 0이면 "zero"를, 0보다 크면 원래 결과를 출력하세요.`,
        hint: `${p.hint} (if-else if-else 구조를 활용하세요)`,
        twisted: true,
        originalId: p.id,
        twistType: 'conditionalExtend'
      };
    }
  },
  {
    // 반복문 강화: 역순 출력 등
    match: (p) => p.category === 'loop',
    twist: (p) => {
      const isReverse = Math.random() > 0.5;
      return {
        ...p,
        id: `battle_${p.id}`,
        title: `🔥 ${p.title} (${isReverse ? '역순' : '합산'})`,
        description: `${p.description}\n\n⚡ 배틀 조건: ${isReverse ? '결과를 역순으로 출력하세요.' : '모든 출력 값의 합을 마지막 줄에 추가로 출력하세요.'}`,
        hint: `${p.hint} (${isReverse ? '배열에 저장 후 역순 출력' : '변수에 합을 누적하세요'})`,
        twisted: true,
        originalId: p.id,
        twistType: isReverse ? 'reverse' : 'sumAppend'
      };
    }
  },
  {
    // 배열/문자열/함수/구조체 강화
    match: (p) => ['array', 'string', 'function', 'structure'].includes(p.category),
    twist: (p) => {
      return {
        ...p,
        id: `battle_${p.id}`,
        title: `🔥 ${p.title} (심화)`,
        description: `${p.description}\n\n⚡ 배틀 조건: 결과 출력 전에 "Result: "를 앞에 붙여 출력하세요.`,
        hint: `${p.hint} (printf의 서식 문자열에 "Result: "를 추가하세요)`,
        twisted: true,
        originalId: p.id,
        twistType: 'prefixResult'
      };
    }
  }
];

export function generateHarderProblem() {
  const allProblems = getAllProblems();
  const baseProblem = allProblems[Math.floor(Math.random() * allProblems.length)];
  
  // 매칭되는 트위스트 템플릿 찾기
  const matchingTwists = twistTemplates.filter(t => t.match(baseProblem));
  if (matchingTwists.length === 0) {
    // 매칭되는 템플릿이 없으면 기본 변형
    return {
      ...baseProblem,
      id: `battle_${baseProblem.id}`,
      title: `🔥 ${baseProblem.title}`,
      description: `${baseProblem.description}\n\n⚡ 배틀 조건: 결과 출력 후 줄바꿈하고 "done"을 출력하세요.`,
      twisted: true,
      originalId: baseProblem.id,
      twistType: 'appendDone'
    };
  }
  
  const twist = matchingTwists[Math.floor(Math.random() * matchingTwists.length)];
  return twist.twist(baseProblem);
}

// 랜덤 문제 가져오기 (이전에 출제된 문제 제외)
export function getRandomBattleProblem(excludeIds = []) {
  let attempts = 0;
  let problem;
  do {
    problem = generateHarderProblem();
    attempts++;
  } while (excludeIds.includes(problem.originalId) && attempts < 20);
  return problem;
}
