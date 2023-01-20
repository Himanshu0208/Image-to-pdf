const image_list = []
const dropzone = document.getElementById('drag-area');
const browseButton = document.getElementById('browse-button');
const imageInput = document.getElementById('image-input')
let id;
let row = 0;
let coloumn = 0;
let count = 0;
var delete_count = 0;
const innerWidth = document.documentElement.clientWidth
var images;
if (innerWidth < 481) {
  images = 1
} else if(innerWidth > 481 && innerWidth < 1000){
  images = 2
}else{
  images = 4
}
// handle drag and drop events
dropzone.addEventListener('dragover', e => {
  e.preventDefault();
  dropzone.classList.add('active')
  console.log('in');
});

dropzone.addEventListener('dragleave', e => {
  e.preventDefault();
  dropzone.classList.remove('active')
  console.log('out');
  dropzone.style.borderColor = '#ccc';
});

dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.style.borderColor = '#ccc';
  handleDrop(e.dataTransfer.files);
});

// handle click events
browseButton.addEventListener('click', () => {
  imageInput.click();
});

imageInput.addEventListener('change', e => {
  handleDrop(e.target.files);
});


// handle file input
async function handleDrop(files) {
  let p = new Promise((resolve, reject) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // do something with the file (e.g. display it, upload it, etc.)
      let read_file = new FileReader();
      if(row%images == 0){
        coloumn += 1;
        id = `row${coloumn}`;
        let element= document.createElement('div');
        element.setAttribute('class','row');
        element.setAttribute('id',id);
        container.appendChild(element);
      }
      createImage(id, read_file);
      row += 1 
      read_file.readAsDataURL(file);
    }
    resolve(true);
  })
  
  let temp = await p 
  console.log(image_list.length)
  document.getElementsByClassName('title')[0].style.display = 'none';
  document.getElementsByClassName('title')[1].style.display = 'block';
  document.getElementById("container1").style.display = 'none';
  document.getElementById("container2").style.display = 'block';
}

// Preview Part
const input_file = document.getElementById('inputFile');
const container = document.getElementById('container');
const addmore = document.getElementById('addMore');
const download = document.getElementById('downloadPDF')


// Delete the image on clicking red cross button
function deleteImage(imageContainer){
    console.log("deleting the image event fierd");
    let index = imageContainer.parentElement.getAttribute('id');
    index -= delete_count;
    image_list.splice(index,1);
    console.log(image_list.length);
    let size = input_file.length;
    if(size == 0){
        console.log("remove downloadPDF");
        document.getElementById('downloadPDF').setAttribute('hidden','true');
    }
    console.log("image at index " + index + " is deleted");
    delete_count += 1;
    imageContainer.parentElement.remove();
    
}

// Creating imageContainers And Putting Them In Row 
function createImage(id , read_file) {
    // Creating Image Container
    let div = document.createElement('div');
    div.setAttribute('id', `${count}`);
    div.setAttribute('class','imageContainer'); 

    // Creating img tag 
    let output = document.createElement('img');
    output.setAttribute('class' , 'image')

    // Creating Red Cross
    let cross =  document.createElement('img');
    cross.setAttribute('class' , 'redCross');
    cross.setAttribute('src' , 'Red-Cross-Mark.png');
    cross.setAttribute('alt' , 'Red Cross X clip art');
    cross.setAttribute('onclick' , 'deleteImage(this)');
    div.appendChild(cross);

    console.log(read_file);
    console.log(document.getElementById(id));
    console.log(id);
    read_file.addEventListener('load', function () {
        image_list.push(read_file.result);
        output.setAttribute('src',read_file.result);
        document.getElementById(id).appendChild(div);
    })

    div.appendChild(output);
    count += 1;   
}

// function to make input_file null on every click
addmore.addEventListener('click' , function(){
    console.log("addmore clicked");
    input_file.click();
    
})

function preview(){
  console.log("input_file event listner is fiered")

console.log(images, innerWidth);
  // Reading the Selected file

  let read_file = new FileReader();
  console.log('images', images);
  if(row%images == 0){
    console.log('a');
      coloumn += 1;
      id = `row${coloumn}`;
      let element= document.createElement('div');
      element.setAttribute('class','row');
      element.setAttribute('id',id);
      container.appendChild(element);
  }

  createImage(id, read_file);
  read_file.readAsDataURL(this.files[0]);
  row += 1;
}

// Taking input on change
input_file.addEventListener('change' , preview)

download.addEventListener('click' , function(){
    console.log("download event fired")
    let doc = new jsPDF("p" , "mm" , "a4");
    const max_width = doc.internal.pageSize.getWidth();
    const max_height = doc.internal.pageSize.getHeight();

    for (let index = 0; index < image_list.length; index++) {
        var img = new Image();
        img.src = image_list[index];
        let height = img.height;
        let width = img.width;
        let ratio = height / width;

        console.log(height + " " + width);
        console.log(max_height + " " + max_width);
        if(height > max_height && width > max_width){
//             height = max_height;
            width = max_width;
            height = width * ratio;

        }else if(height > max_height || width > max_width){
            if(height > width){
                height = max_height;
                width = height/ratio;
            }else if(width > height){
                width = max_width;
                height = width * ratio;
            }
        }

        doc.addImage(image_list[index] , 0 , 0 , width , height);
        doc.addPage("p" , "mm" , "a4");
    }
    doc.deletePage(image_list.length + 1);

    let date = new Date();
    let pdf_name = `PdfMaster${date}.pdf`;
    doc.save(pdf_name);
})
