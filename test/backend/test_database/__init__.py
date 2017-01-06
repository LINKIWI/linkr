# The main Flask application needs to imported before any of the database tests so that linkr.db
# is defined before attempting to access any of the database modules database.*.
# This is the result of a import "race condition" caused by the fact that Flask requires references
# to any libraries to be declared explicitly as a global variable before potentially more imports
# that make use of that library.
# Honestly, just don't worry about it, and don't touch this line
import linkr
