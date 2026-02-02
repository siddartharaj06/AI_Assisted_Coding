# Zero shot prompt

# Generate a Python function that counts vowels in a string.

def count_vowels(input_string):
    """
    Count the number of vowels in a given string.

    Parameters:
    input_string (str): The string to count vowels in.

    Returns:
    int: The number of vowels in the string.
    """
    vowels = "aeiouAEIOU"
    count = sum(1 for char in input_string if char in vowels)
    return count

# Example usage:
test_string = "hello"
vowel_count = count_vowels(test_string)
print(f"The number of vowels in '{test_string}' is {vowel_count}.")

# Few shot prompt

# Generate a Python function that counts vowels in a string.
# Example
# Input: hello
# Output: 2

def count_vowels(input_string):
    """
    Count the number of vowels in a given string.

    Parameters:
    input_string (str): The string to count vowels in.

    Returns:
    int: The number of vowels in the string.
    """
    vowels = "aeiouAEIOU"
    count = sum(1 for char in input_string if char in vowels)
    return count

# Example usage:
test_string = "hello"
vowel_count = count_vowels(test_string)
print(f"The number of vowels in '{test_string}' is {vowel_count}.")

# Remark:
# The function count_vowels takes a string input and counts the number of vowels (both uppercase and lowercase)
# present in the string. It uses a generator expression to iterate through each character and checks if
# it is a vowel. The example usage demonstrates how to call the function and print the result.
# The function works correctly for the provided example and can be tested with other strings as well.

# Comparative Analysis:
# Both the zero-shot and few-shot prompts generate the same function, count_vowels, which counts the number of vowels in a given string.
# The few-shot prompt includes an example input and output, which helps clarify the expected behavior of the function. This additional context can be beneficial for understanding the function's purpose and usage.
# However, since the function is relatively simple, the zero-shot prompt is sufficient to produce the correct implementation without any examples.
# Both implementations include detailed docstrings explaining the function's parameters and return values.
# The few-shot prompt also includes a remark section that elaborates on the function's logic and
# usage, which can be helpful for users who are less familiar with the code.
# Both the zero-shot and few-shot prompts generate the same function, count_vowels, which counts the number of vowels in a given string.
# The few-shot prompt includes an example input and output, which helps clarify the expected behavior of
# the function. This additional context can be beneficial for understanding the function's purpose and usage.
# However, since the function is relatively simple, the zero-shot prompt is sufficient to produce the
# correct implementation without any examples.
# Both implementations include detailed docstrings explaining the function's parameters and return values.
# The few-shot prompt also includes a remark section that elaborates on the function's logic and
# usage, which can be helpful for users who are less familiar with the code.