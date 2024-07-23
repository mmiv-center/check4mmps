<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/select2.min.css">
    <link rel="stylesheet" href="css/colorbrewer.css">
    <link rel="stylesheet" href="css/style.css?_=11111">
    
    <title>ReviewZip</title>
  </head>
  <body>

    <header id="header">
  <div class="collapse bg-dark" id="navbarHeader">
    <div class="container">
      <div class="row">
        <div class="col-sm-8 col-md-7 py-4">
          <h4 class="text-white">About</h4>
          <p class="text-muted">Review a zip file with DICOM inside to make sure we forward the right information. This page will not transfer any files to our server.</p>
        </div>
        <div class="col-sm-4 offset-md-1 py-4">
          <h4 class="text-white">Contact</h4>
          <ul class="list-unstyled">
	    <li><a href="mailto:Hauke.Bartsch@helse-bergen.no" class="text-white">Hauke Bartsch</a></li>
	    <li><a href="mailto:zhanbolat.satybaldinov@helse-bergen.no" class="text-white">Zhanbolat Satybaldinov</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="navbar navbar-dark bg-dark shadow-sm">
    <div class="container d-flex justify-content-between">
      <a href="#" class="navbar-brand d-flex align-items-center">
        <strong>ReviewZip</strong>
      </a>
      <a href="/index.php" class="d-flex align-items-center nav-link navbar-text" title="Back to Steve">
        Steve
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </div>
</header>

    
    <div class="container-fluid">
      <div class="row-fluid" style="margin-top: 10px;">
	<p>This page only accepts zip folders and parses them for DICOM files. It is safe to use this application on sensitive data as no part of your zip-files will be uploaded to any server. Will we not track who or how often this service is used. All computations are done in your web-browser.</p>

	<!-- <input type="file" id="file" name="file" multiple /><br /> -->

	<div class="col-lg-6 col-sm-12 col-12" style="padding-left: 0px;">
	  
          <div class="input-group">
            <label class="input-group-btn">
              <span class="btn btn-primary">
                Browse File <input type="file" id="file" style="display: none;" multiple>
              </span>
            </label>
            <input type="text" class="form-control" readonly>
          </div>
          
        </div>

	
	<div style="margin-top: 30px;">
	  <h4>Content</h4>
	  <h5>Summary</h5>
	  <div>
	    <span id="stat"></span>
	  </div>
	</div>
      </div>
      <div id="series-results" class="row" style="margin-left: 0px; margin-right: 0px;"></div>
      <div class="row-fluid" style="margin-top: 20px">
	  <h5 style="margin-top: 20px;">Details</h5>
	  <div id="results">Load a zip-file first...</div>
      </div>
    </div>

    <a id="go-up-arrow" href="#header" style="position: fixed; bottom: 100px; right: 100px; display: none">
        <img src="up-arrow.png" alt="Up arrow">
    </a>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="js/jquery-3.6.1.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/moment-with-locales.min.js" type="text/javascript"></script>
    <script src="js/select2.min.js"></script>
    <script src="js/jszip.min.js"></script>
    <script src="js/dicomParser.min.js"></script> 
    <script src="js/all.js?_=sdfsdf" type="text/javascript"></script>
  </body>
</html>
