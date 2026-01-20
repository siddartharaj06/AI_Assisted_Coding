#Write a Python function that checks whether a given number is a perfect number.

# Function to check if a number is a perfect number
def is_perfect_number(number):
    # Check for invalid input
    if not isinstance(number, int) or number <= 0:
        return False
    
    # Calculate the sum of proper divisors
    sum_of_divisors = sum(i for i in range(1, number) if number % i == 0)
    
    # A perfect number is equal to the sum of its proper divisors
    return sum_of_divisors == number
# Example usage:
print(is_perfect_number(6))    # True
print(is_perfect_number(28))   # True
print(is_perfect_number(12))   # False
print(is_perfect_number(-6))   # False
print(is_perfect_number(0))    # False
print(is_perfect_number(496))  # True
print(is_perfect_number(8128)) # True
