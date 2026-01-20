#Write a Python program to check whether a number is Even or Odd
# with proper input validation.

# Examples:
# Input: 8 → Output: Even
# Input: 15 → Output: Odd
# Input: 0 → Output: Even

def check_even_odd(number):
    # Check for invalid input
    if not isinstance(number, int):
        return "Invalid input"
    
    # Check if the number is even or odd
    if number % 2 == 0:
        return "Even"
    else:
        return "Odd"
# Example usage:
print(check_even_odd(8))    # Even
print(check_even_odd(15))   # Odd
print(check_even_odd(0))    # Even
print(check_even_odd(-4))   # Even
print(check_even_odd("test"))  # Invalid input
print(check_even_odd(7.5))    # Invalid input
print(check_even_odd(23))   # Odd
print(check_even_odd(-11))  # Odd
print(check_even_odd(42))   # Even
print(check_even_odd(100))  # Even
print(check_even_odd(-99))  # Odd
print(check_even_odd(1))    # Odd
print(check_even_odd(2))    # Even
print(check_even_odd(3))    # Odd
print(check_even_odd(4))    # Even
print(check_even_odd(5))    # Odd
print(check_even_odd(6))    # Even
