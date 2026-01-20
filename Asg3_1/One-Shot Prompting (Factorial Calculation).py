#Write a Python function to calculate the factorial of a given number.
#Example:
#Input: 5
#Output: 120


# Function to calculate the factorial of a number
def factorial(n):
    # If the number is negative, return None (factorial is not defined for negative numbers)
    if n < 0:
        return None
    # If the number is 0 or 1, return 1 (base case)
    elif n == 0 or n == 1:
        return 1
    else:
        result = 1
        # Calculate factorial iteratively
        for i in range(2, n + 1):
            result *= i
        return result
# Example usage:
print(factorial(5))  # 120
print(factorial(0))  # 1
print(factorial(-3)) # None
