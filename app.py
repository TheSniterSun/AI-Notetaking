from flask import Flask, render_template, request
import openai

app = Flask(__name__, static_url_path='/static')

openai.api_key = "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"

def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            file_contents = file.read()
            return file_contents
    except FileNotFoundError:
        print(f"The file '{file_path}' could not be found.")
        return None
    except Exception as e:
        print(f"An error occurred while reading '{file_path}': {e}")
        return None

def divide_string(input_string, chunk_size=16000):
    if not isinstance(input_string, str) or not isinstance(chunk_size, int):
        raise ValueError("Input must be a string and chunk_size must be an integer.")

    if chunk_size <= 0:
        raise ValueError("Chunk size must be greater than 0.")

    chunks = [input_string[i:i + chunk_size] for i in range(0, len(input_string), chunk_size)]
    return chunks

def generate_openai_response(contents, contents2, contents3):
    list_of_pieces = divide_string(contents2)
    print_final = ""

    for each in list_of_pieces:
        contents4 = contents3 + "\n\nRaw Slides Text:\n" + contents + "\n\nRaw Lecture Transcript:\n" + each
        print("COMBINED PROMPT: \n" + contents4)
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-1106",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": contents4}],
            max_tokens=4096
        )
        printing = response['choices'][0]['message']['content']
        print_final += printing  # Accumulate the generated content

    return print_final

@app.route('/process', methods=['POST', 'GET'])
def process():
    if request.method == 'POST':
        if 'file1' not in request.files or 'file2' not in request.files:
            return "Error: Please select both files."

        file1 = request.files['file1']
        file2 = request.files['file2']
        front_path = 'front.txt'
        contents3 = read_file(front_path)

        contents = file1.read().decode('utf-8')
        contents2 = file2.read().decode('utf-8')

        to_print = generate_openai_response(contents, contents2, contents3)

        return to_print  # Return only the generated content as plain text
    else:
        return "Invalid request method."

@app.route('/')
def index():
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)
