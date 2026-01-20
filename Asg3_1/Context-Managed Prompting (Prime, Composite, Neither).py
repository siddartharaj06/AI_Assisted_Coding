#Write an optimized Python program to classify a number as Prime,
# Composite, or Neither.

# Constraints:
# - Handle invalid inputs
# - Use efficient logic
# - Numbers less than or equal to 1 should be classified as Neither

def classify_number(number):
    # Check for invalid input
    if not isinstance(number, int):
        return "Invalid input"
    
    # Numbers less than or equal to 1 are classified as Neither
    if number <= 1:
        return "Neither"
    
    # Check for primality
    if number == 2:
        return "Prime"
    if number % 2 == 0:
        return "Composite"
    
    for i in range(3, int(number**0.5) + 1, 2):
        if number % i == 0:
            return "Composite"
    
    return "Prime"

# Example usage:
print(classify_number(11))  # Prime
print(classify_number(15))  # Composite
print(classify_number(1))   # Neither
print(classify_number(-5))  # Neither
print(classify_number(2))   # Prime
print(classify_number(4))   # Composite
print(classify_number("abc"))  # Invalid input

