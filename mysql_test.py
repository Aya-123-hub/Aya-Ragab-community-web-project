import mysql.connector

# Establish a connection to the database
connection = mysql.connector.connect(
    host="localhost",
    user="ayaragab650@gmail.com",
    password="Ayayoyoyota123@&",
    database="my_database"
)

# Create a cursor object to execute SQL queries
cursor = connection.cursor()

# Insert a new post into the 'posts' table
insert_query = """
INSERT INTO posts (user_id, title, content)
VALUES (%s, %s, %s)
"""
data_to_insert = (1, "New Post Title", "This is the content of the new post.")
cursor.execute(insert_query, data_to_insert)

# Commit the changes to the database
connection.commit()

# Retrieve all posts from the 'posts' table
cursor.execute("SELECT * FROM posts")
rows = cursor.fetchall()

# Print the retrieved posts
print("Posts in the database:")
for row in rows:
    print(row)

# Close the cursor and the connection
cursor.close()
connection.close()
