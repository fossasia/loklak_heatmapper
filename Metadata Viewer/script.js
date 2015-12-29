var input = document.getElementById('input');
input.addEventListener('change', readMetadata, false);

var dragBox = document.getElementById('dropBox');
dragBox.addEventListener('dragover', dragOver, false);
dragBox.addEventListener('dragleave', dragLeave, false);
dragBox.addEventListener('drop', readMetadata, false);

function dragOver(e) {
  e.stopPropagation();
  e.preventDefault();
  dragBox.style.backgroundColor = "#2D7DD2";  // Set the background color of the dropBox to blue, if hovering with a file
}

function dragLeave(e) {
  e.stopPropagation();
  e.preventDefault();
  dragBox.style.backgroundColor = "grey"; // Set dropBox's background color to its default, when a file isn't hovering anymore
}

function bytesToSize(bytes) { // Thanks to http://stackoverflow.com/a/18650828
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   if (bytes == 0) return '0 Bytes';
   var n = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));  // Get the appropiate order of magnitude
   return Math.round(bytes / Math.pow(1024, n), 2) + ' ' + sizes[n] + ' (' + bytes + ' Bytes)';
}

function readMetadata(e) {
  e.preventDefault(); // Avoid opening the files, if the function has been called from the drag&drop event
  var fileList = this.files || e.dataTransfer.files;  // Get file list, depending on if the function's been
                                                      // called from the drag&drop event or the input one

  var resultsBox = document.getElementById('resultsBox');
  var name, size, type, lm;

  resultsBox.style.display = 'block'; // Make the results box visible

  while(resultsBox.childElementCount > 2) { // Empty the results box, except for the title and the line break
    resultsBox.removeChild(resultsBox.lastChild);
  }

  for(var i = 0; i < fileList.length; i++) {  // Display corresponding info per each file
    name = document.createElement('span');
    name.innerHTML = '<b>FILE #' + (i + 1) + ': ' + fileList[i].name + '</b><br>';
    resultsBox.appendChild(name);
    size = document.createElement('span');
    size.innerHTML = '<b>&nbsp;&nbsp;Size: </b>' + bytesToSize(fileList[i].size) + '<br>';
    resultsBox.appendChild(size);
    type = document.createElement('span');
    type.innerHTML = '<b>&nbsp;&nbsp;Type: </b>' + (fileList[i].type || 'none or unknown' ) + '<br>';
    resultsBox.appendChild(type);
    lm = document.createElement('span');
    lm.innerHTML = '<b>&nbsp;&nbsp;Last modified: </b>' + fileList[i].lastModifiedDate + '<br>';
    resultsBox.appendChild(lm);
  }
}
