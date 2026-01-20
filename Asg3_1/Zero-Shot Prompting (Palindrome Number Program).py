#Write a Python function that checks whether a given number is a palindrome.
#The function should return True if the number is a palindrome and False otherwise.

# Function to check if a number is a palindrome
def is_palindrome(number):
    # Convert the number to string
    str_num = str(number)
    # Check if the string is the same forwards and backwards
    return str_num == str_num[::-1]     

# Example usage:
print(is_palindrome(121))  # True
print(is_palindrome(-121)) # False
print(is_palindrome(10))   # False

