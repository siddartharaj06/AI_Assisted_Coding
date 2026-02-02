# Generate a Python function that reads a text file and counts the number of lines.
# Example
# File content
# Hello
# World
# Output
# 2

def count_lines_in_file(file_path):
    """
    Count the number of lines in a text file.

    Parameters:
    file_path (str): The path to the text file.

    Returns:
    int: The number of lines in the file.
    """
    with open(file_path, 'r') as file:
        lines = file.readlines()
        return len(lines)

# Example usage:
file_path = 'example.txt'  # Make sure to create this file with some content for testing
line_count = count_lines_in_file(file_path)
print(f"The number of lines in the file is {line_count}.")

# Remark:
# The function count_lines_in_file takes a file path as input, opens the file in read mode,
# reads all the lines, and returns the count of lines. The example usage demonstrates how to
# call the function and print the result. Ensure that the specified file exists for testing.
# The function works correctly for the provided example and can be tested with other text files as well
# logic, which may be particularly useful for users unfamiliar with the implementation details.