#Write a Python function to check whether a number is an Armstrong number.

# Examples:
# Input: 153 → Output: Armstrong Number
# Input: 370 → Output: Armstrong Number
# Input: 123 → Output: Not an Armstrong Number

# Function to check if a number is an Armstrong number
def is_armstrong_number(number):    
    # Convert the number to string to easily iterate over digits
    str_num = str(number)
    num_digits = len(str_num)
    sum_of_powers = sum(int(digit) ** num_digits for digit in str_num)
    
    # Check if the sum of the powers is equal to the original number
    return sum_of_powers == number
# Example usage:
print(is_armstrong_number(153))  # True
print(is_armstrong_number(370))  # True
print(is_armstrong_number(123))  # False
