# Generate a Python function that converts centimeters to inches.
# Example
# Input: 10 cm
# Output: 3.94 inches

def cm_to_inches(cm):
    """
    Convert centimeters to inches.

    Parameters:
    cm (float): The length in centimeters.

    Returns:
    float: The length in inches.
    """
    inches = cm / 2.54
    return round(inches, 2)

# Example usage:
cm_value = 10
inches_value = cm_to_inches(cm_value)
print(f"{cm_value} cm is equal to {inches_value} inches.")

# Remark:
# The function cm_to_inches takes a float input representing centimeters and converts it to inches by dividing
# by 2.54. The result is rounded to two decimal places for better readability.