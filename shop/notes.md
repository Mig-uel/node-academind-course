# Model View Controller

## Model

- Responsible for representing your data
- Responsible for managing your data (saving, updating, deleting)
- Doesn't matter if you manage data in a database, a file, or in memory
- Contains data-related logic

## View

- What the user sees
- Responsible for displaying your data
- Doesn't matter if you display data in a web page, a mobile app, or a desktop app
- Contains display-related logic
- Shouldn't contain too much logic

## Controller

- The glue between the model and the view
- Connects the model and the view
- Should only make sure that the model and view communicate with each other (in both directions)
- Contains application-related logic

## Example

- Model: A class that represents a user
- View: A web page that displays the user's name
- Controller: A class that connects the user model with the web page view
