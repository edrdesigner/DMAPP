/*
 	Author: Vishal Rajpal
 	Filename: ZipPlugin.js
 	Date: 21-02-2012
*/

var ExtractZipFilePlugin=function(){
};

PhoneGap.addConstructor(function() 
{
	PhoneGap.addPlugin('ExtractZipFilePlugin', new ZipPlugin());
});

ExtractZipFilePlugin.prototype.extractFile = function(file, successCallback, errorCallback) 
{
	alert(file+'phonegap');
    return PhoneGap.exec(successCallback, errorCallback, "ZipPlugin", "extract", [file]);
};


function extractFile(fileName)
{
	alert(fileName);
	var ZipClient = new ExtractZipFilePlugin();
	ZipClient.extractFile(fileName,win,fail,'ExtractZipFilePlugin');
}

function win(status) 
{ 
   alert('Success'+status);
} 
  
function fail(error) 
{ 
	alert(error);
}