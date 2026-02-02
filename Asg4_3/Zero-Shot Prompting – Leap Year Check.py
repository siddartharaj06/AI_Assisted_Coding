# Generate a Python function that accepts a year as input, checks whether it is a leap year using correct logical conditions, and returns an appropriate result.

def is_leap_year(year):
    """
    Check if a given year is a leap year.

    A year is a leap year if:
    - It is divisible by 4;
    - Except for years that are divisible by 100, unless they are also divisible by 400.

    Parameters:
    year (int): The year to check.

    Returns:
    bool: True if the year is a leap year, False otherwise.
    """
    if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
        return True
    else:
        return False

# Example usage:
year = 2020
if is_leap_year(year):
    print(f"{year} is a leap year.")
else:
    print(f"{year} is not a leap year.")

# Remark: 
# The function correctly implements the leap year rules and can be tested with different year inputs.
# The example usage demonstrates how to call the function and print the result.
# Generate a Python function that accepts a year as input, checks whether it is a leap year using correct logical conditions, and returns an appropriate result.