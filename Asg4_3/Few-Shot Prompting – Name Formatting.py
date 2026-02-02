# Generate a Python function that accepts a full name and formats it as Last, First.
# Examples
# John Smith to Smith, John
# Anita Rao to Rao, Anita

def format_name(full_name):
    """
    Format a full name from 'First Last' to 'Last, First'.

    Parameters:
    full_name (str): The full name in 'First Last' format.

    Returns:
    str: The formatted name in 'Last, First' format.
    """
    names = full_name.split()
    if len(names) != 2:
        raise ValueError("Input must be a full name with exactly two parts: 'First Last'")
    
    first_name, last_name = names
    formatted_name = f"{last_name}, {first_name}"
    return formatted_name

# Example usage:
full_name = "John Smith"
formatted = format_name(full_name)
print(f"Formatted Name: {formatted}")

# Remark:
# The function format_name takes a string input representing a full name in 'First Last' format
# and splits it into first and last names. It then rearranges and formats them as 'Last, First'.
# The example usage demonstrates how to call the function and print the formatted name.
# The function raises a ValueError if the input does not contain exactly two parts.