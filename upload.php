<?php

$target_dir = "uploads/";
$tiffExtensions = ["svs", "ndpi"];

//syslog(LOG_EMERG, "files: ".json_encode($_FILES["files"]). " " .count($_FILES["files"]["name"]));

function tempdir() {
    $tempfile=tempnam("/export/Attach/",'');
    // you might want to reconsider this line when using this snippet.
    // it "could" clash with an existing directory and this line will
    // try to delete the existing one. Handle with caution.
    if (file_exists($tempfile)) { unlink($tempfile); }
    mkdir($tempfile);
    if (is_dir($tempfile)) { return $tempfile; }
}

function rrmdir($src) {
    $dir = opendir($src);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            $full = $src . '/' . $file;
            if ( is_dir($full) ) {
                rrmdir($full);
            }
            else {
                unlink($full);
            }
        }
    }
    closedir($dir);
    rmdir($src);
}

function processTiff($filePath) {
    // $seriesNumber indicates which layer should be saved from TIFF pyramid,
    // for Hamamatsu ndpi barcode is at level 7
    $seriesNumber = 7;
    $file = basename($filePath);
    $fileName = substr($file, 0, strpos($file, "."));
    // command to execute saving a series, which contain an image with the barcode
    $cmd = "/var/www/html/applications/Attach/bftools/bfconvert -series $seriesNumber /var/www/html/applications/Attach/$filePath /var/www/html/applications/Attach/barcodes/$fileName.png";
    $result = shell_exec($cmd);
    var_dump($result);
}

for ($i = 0; $i < count($_FILES["files"]["name"]); $i++) {
  $target_file = $target_dir . basename($_FILES["files"]["name"][$i]);
  $uploadOk = 1;

  $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
  // Check if image file is a actual image or fake image
  if (isset($_POST["submit"])) {
    $check = getimagesize($_FILES["files"]["tmp_name"][$i]);
    if($check !== false) {
      echo "File is an image - " . $check["mime"] . ".";
      $uploadOk = 1;
    } else {
      echo "File is not an image.";
      $uploadOk = 0;
    }
  } 
  if ($uploadOk) {
    // instead of moving the file we should work with the current location of the file
    syslog(LOG_EMERG, "file type is: ". $imageFileType);
    if ($imageFileType == "zip") {
      $tdir = tempdir();
      // create a new folder and uncompress, afterwards look at each file
      $zip = new ZipArchive;
      //syslog(LOG_EMERG, "structure is: ".json_encode($_FILES["files"]));
      if ($zip->open($_FILES["files"]["tmp_name"][$i]) === TRUE) {
        $zip->extractTo($tdir);
	//syslog(LOG_EMERG, "store unzip data in ".$tdir);
        $zip->close();

	// we have information about what project this should be, add those so we can see them
	syslog(LOG_EMERG, "all post variables are: ".json_encode($_POST));
	$project = $_POST['hid_project'];
	$participant = $_POST['hid_participant'];
	$event = $_POST['hid_event'];
	// in the Assign interface for proper anonymization
	$cmd = "find \"$tdir\" -type f -print | xargs -I'{}' /usr/bin/dcmodify -nb -m 'PatientID=$participant' -m 'PatientName=$participant' -i 'InstitutionName=$project' -i 'ReferringPhysician=Eventname:$event' {}";
	syslog(LOG_EMERG, "Run this anonymization: ".$cmd);
	$out = shell_exec($cmd);
	syslog(LOG_EMERG, "dcmodify returns: ".$out);
	// for now only support DICOM
	$cmd = "/var/www/html/server/utils/s2m.sh \"".$tdir."\"";
	$ret = shell_exec($cmd);
	// delete the folder tdir again
	syslog(LOG_EMERG, "got this from s2m.sh back: ".$ret);		

        // now call the plugins for that temp folder
	// each plugin is allowed to remove a file if it can handle it
	$plugins = glob("plugins/*/info.json");
	foreach ($plugins as $plugin) {
	  $data = json_encode(file_get_contents($plugin));
	  if (!isset($data['work'])) {
	    continue;
	  }
	  $folder = split("/", $plugin)[1];
	  require($folder."/".$data['work']);
	  work($tdir);
	}
	// and delete the folder again
	if (is_dir($tdir)) {
	   rrmdir($tdir);
	}
      }
   } else if (in_array($imageFileType, $tiffExtensions)) {
       syslog(LOG_EMERG, "file type is: ". $target_file);
       // do something with $_FILES["files"]["tmp_name"][$i]
       $file = $_FILES["files"]["name"][$i];
       $path = pathinfo($file);
       $filename = $path["filename"];
       $ext = $path["extension"];
       $tempName = $_FILES["files"]["tmp_name"][$i];
       $fullPath = $target_dir.$filename.".".$ext;
       
       move_uploaded_file($tempName, $fullPath);
       processTiff($fullPath);


       header("HTTP/1.1 200 OK");
       header("Content-Type: application/json; charset=UTF-8");

       return json_encode(['message' => $message]);
   } else {
       syslog(LOG_EMERG, "Unknown file extension".$target_file);
   }
  }
}

echo("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Upload Done</title></head><body>Upload is done (<a href=\"https://fiona.medtek.hbe.med.nvsl.no/applications/Attach/\">Back to Steve</a>).</body></html>");
?>