# Trig and Hyperbolic functions

The following list contains the functions that you can use to calculate trigonometric and hyperbolic values.

For information about using string and numeric fields in functions, and nesting functions, see [Evaluation functions](/splunk-enterprise/search/spl-search-reference/10.0/evaluation-functions/evaluation-functions#id_71626c78_36e3_447a_bb2d_1751088caa84__Evaluation_functions).

## acos(X)

### Description

This function computes the arc cosine of X, in the interval [0,pi] radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

This example returns `1.5707963267948966`.

... | eval n=acos(0)

The following example calculates 180 divided by *pi* and multiplies the result by the arc cosine of 0. This example returns `90.0000000003`.

... | eval degrees=acos(0)\*180/pi()

## acosh(X)

### Description

This function computes the arc hyperbolic cosine of X radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

This example returns `1.3169578969248166`.

... | eval n=acosh(2)

## asin(X)

### Description

This function computes the arc sine of X, in the interval [-pi/2,+pi/2] radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

This example returns `1.5707963267948966`.

... | eval n=asin(1)

The following example calculates 180 divided by *pi* and multiplies that by the arc sine of 1.

... | eval degrees=asin(1)\*180/pi()

## asinh(X)

### Description

This function computes the arc hyperbolic sine of X radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

This example returns `0.881373587019543`.

... | eval n=asinh(1)

## atan(X)

### Description

This function computes the arc tangent of X, in the interval [-pi/2,+pi/2] radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

This example returns `0.46`.

... | eval n=atan(0.50)

## atan2(Y, X)

### Description

This function computes the arc tangent of Y, X in the interval [-pi,+pi] radians.

Y is a value that represents the proportion of the y-coordinate. X is the value that represents the proportion of the x-coordinate.

To compute the value, the function takes into account the sign of both arguments to determine the quadrant.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

This example returns `0.59`.

... | eval n=atan2(0.50, 0.75)

## atanh(X)

### Description

This function computes the arc hyperbolic tangent of X radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

This example returns `0.549`.

... | eval n=atanh(0.500)

## cos(X)

### Description

This function computes the cosine of an angle of X radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

This example returns `0.5403023058681398`.

... | eval n=cos(-1)

The following example calculates the cosine of *pi* and returns `-1.00000000000`.

... | eval n=cos(pi())

## cosh(X)

### Description

This function computes the hyperbolic cosine of X radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

This example returns `1.5430806348152437`.

... | eval n=cosh(1)

## hypot(X,Y)

### Description

This function computes the hypotenuse of a right-angled triangle whose legs are X and Y.

The function returns the square root of the sum of the squares of X and Y, as described in the Pythagorean theorem.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

Creates a field called `n` and returns `n=5`, which is the hypotenuse of a triangle whose legs are 3 and 4.

... | eval n=hypot(3,4)

## sin(X)

### Description

This function computes the sine of X.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

This example returns `0.8414709848078965`.

... | eval n=sin(1)

The following example calculates the sine of *pi* divided by 180 and then multiplied by 90.

... | eval n=sin(90 \* pi()/180)

## sinh(X)

### Description

This function computes the hyperbolic sine of X radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

This example returns `1.1752011936438014`.

... | eval n=sinh(1)

## tan(X)

### Description

This function computes the tangent of X radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic examples

This example returns `1.5574077246549023`

... | eval n=tan(1)

This example returns `-0.08871575677006045`

... | eval n=tan(135)

## tanh(X)

### Description

This function computes the hyperbolic tangent of X radians.

### Usage

You can use this function with the `eval`, `fieldformat`, and `where` commands, and as part of eval expressions.

### Basic example

This example returns `0.7615941559557649`

... | eval n=tanh(1)
