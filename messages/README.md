Every assignment and lab shall include a README file that describes the work. This description must:

Identify what aspects of the work have been correctly implemented and what have not.
Identify anyone with whom you have collaborated or discussed the assignment.
Say approximately how many hours you have spent completing the assignment.
Be written in either text format (README.txt) or in Markdown (README.md). No other formats will be accepted.


David Bernstein
Lab 6 - Messages README
Comp 20 - Web Programming
March 10, 2016

 - To the best of my knowledge, all of the work have been correctly implemented.
 - I worked on this lab alone, though I referred to TAs Thomas Colgrove and Elif 
   Kinli.
 - I spent approximately 2 hours on this assignment.

I split up the lab using two variabels for the urls: one for getting local json,
and one for getting json from the herokuapp. It is not possible to request data 
from the herokuapp using XMLHttpRequest because it is at a different origin, and
the permissions to let others access the json have not been set. Thus, I kept 
the url for the request to go to the local json file to avoid console errors and
to have something on the page that was not just "Messages".
