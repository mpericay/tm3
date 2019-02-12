<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="marti@pericay.com" />
	<!--meta name="robots" content="noindex"-->

    <title>Taxo&Map</title>

    <!-- Custom CSS -->
    <link href="css/sidebar.css" rel="stylesheet" />
    <link href="css/ui.css" rel="stylesheet" />
	<link href="css/breadcrumbs.css" rel="stylesheet" />
<?php 
	session_start();
	/*session is started */
	$_SESSION["tm3"]=microtime(true);
?>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!--[if lt IE 9]><script src="js/ie8-responsive-file-warning.js"></script><![endif]-->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <link type="text/css" rel="stylesheet" href="http://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700,800,600,300' rel='stylesheet' type='text/css'>


</head>

<body>
     <!-- HEADER -->
<div class="personlalize-header personlalize-header-white noprint">
    <div class="navbar navbar-default navbar-fixed-top" role="navigation"><!-- navbar-static-top -->
      <div class="container"> <!-- container-fluid -->

        <!--
        <div class="logo pull-right">
          <a href="http://museuciencies.cat" title="Museu de Ciències Naturals de Barcelona"><img src="http://bioexplora.auupa.com/navigation/images/logo-general-bottom.png" width="100" alt="Museu de Ciències Naturals de Barcelona"></a>
        </div>
        -->
      

        <div class="navbar-header">
        
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>

          <div class="logo">
            <a href="http://museuciencies.cat" title="Museu de Ciències Naturals de Barcelona"><img src="http://bioexplora.auupa.com/navigation/images/logo-nat2.png" alt="Museu de Ciències Naturals de Barcelona"></a>
          </div>

          <a class="navbar-brand" href="http://bioexplora.auupa.com/">
            <span class="bio">BIO</span><span class="explora">EXPLORA</span>
            <div class="slogan">Explora la natura, explora el museu</div>
          </a>

          <div class="menu-languages">
            <ul class="nav">
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">CA <b class="caret"></b></a>
                <ul class="dropdown-menu">
                  <li><a href="?lang=es">ES</a></li>
                  <li><a href="?lang=ca">CA</a></li>
                  <li><a href="?lang=en">EN</a></li>
                </ul>
              </li>            
            </ul>
          </div>

        </div>

        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="dropdown">
                 <a href="http://bioexplora.auupa.com/ca/colleccions" class="dropdown-toggle" >Col·leccions <b class="caret"></b></a>
                <ul class="dropdown-menu">
                  <li  class=""><a href="http://bioexplora.auupa.com/ca/colleccions-obertes">Col·leccions obertes</a></li>
                  <li  class=""><a href="http://taxomap.auupa.com/">Taxo&map</a></li>
                  <li  class=""><a href="http://bioexplora.auupa.com/ncd/">Guia de fons i col·leccions</a></li>
                </ul>
              </li>            
              <li class="dropdown">
                <a href="http://bioexplora.auupa.com/ca/projectes" class="dropdown-toggle" >Projectes <b class="caret"></b></a>
                <ul class="dropdown-menu">
                  <li  class=""><a href="http://bioexplora.auupa.com/ca/models3d/">Atlas 3D</a></li>
                  <li  class=""><a href="http://bioexplora.auupa.com/WIKICOLLECTA/index.php/ca/projectes/especimens-tipus">Espèciments tipus</a></li>
                  <li  class=""><a href="#">Mol·luscs continentals de Catalunya</a></li>
                  <li  class=""><a href="#">Briozous</a></li>
                  <li  class=""><a href="http://bioexplora.auupa.com/WIKICOLLECTA/index.php/ca/projectes/protagonistes">Protagonistes</a></li>
                  <li  class=""><a href="http://bioexplora.auupa.com/georeferenciacio">GEOREFERENCIACIÓ</a></li>
                 
                </ul>
              </li>         
              <li class="dropdown">
                <a href="http://museucienciesjournals.auupa.com/?lang=ca" class="dropdown-toggle" >Publicacions científiques<b class="caret"></b></a>
                <ul class="dropdown-menu">
                  <li  class=""><a href="http://abc.museucienciesjournals.auupa.com/?lang=ca">Animal Biodiversity and Conservation</a></li>
                  <li  class=""><a href="http://amz.museucienciesjournals.auupa.com/?lang=ca">Arxius de Miscel·lània Zoològica</a></li>
                  <li  class=""><a href="http://monografies.museucienciesjournals.auupa.com/?lang=ca">Monografies del MCNB</a></li>
                  <li  class=""><a href="http://tmgb.museucienciesjournals.auupa.com/?lang=ca">Treballs del Museu de Geologia de Barcelona</a></li>
                  <li  class=""><a href="http://other.museucienciesjournals.auupa.com/?lang=ca">Publicacions anteriors</a></li>
                </ul>
              </li>         
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Recursos <b class="caret"></b></a>
                <ul class="dropdown-menu">
                  <li  class=""><a href="http://bioexplora.auupa.com/ca/panoramics">Panoràmiques</a></li>
                </ul>
              </li>  
          </ul>
        </div><!--/.nav-collapse -->
        
      </div>
    </div>
    <!-- HEADER -->
</div>
<div class="personlalize-header-fix noprint"></div>

<!-- Modal -->
 <div id="textModal" class="modal" role="dialog">
   <div class="modal-dialog modal-lg">
 
     <!-- Modal content-->
     <div class="modal-content">
       <div class="modal-header modal-tm3">
         <button type="button" class="close" data-dismiss="modal"></button>
         <!-- <h4 class="modal-title">Modal Header</h4> -->
       </div>
       <div class="modal-body"></div>
       <div class="modal-footer">
         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
       </div>
     </div>
 
   </div>
 </div>
	
    <nav class="navbar navbar-inverse navbar-fixed-top" id="subbar">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
			<!-- Search phone-only -->
			<!--<form class="navbar-form navbar-left visible-xs" role="search">
			  <div class="form-group">
				<input type="text" class="form-control" placeholder="Search">
			  </div>
			</form>-->			
          </button>
	  
		  <a href=""><img src="img/logos/taxomap_trans_big.png" alt="TaxoMamp logo" id="taxomapLogo"></a>
		  <div id="breadcrumbTaxon" class="btn-group btn-breadcrumb breadcrumb"></div>
          
        </div>
		
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
			<li><a data-toggle="modal" data-id="about" title="About" class="open-textModal" href="#textModal">About</a></li>
			<li><a data-toggle="modal" data-id="help" title="Help" class="open-textModal" href="#textModal">Help</a></li>
            <!--<li class="dropdown">
	          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Languages<span class="caret"></span></a>
	          <ul class="dropdown-menu">
	            <li><a href="#" data-id="ca" class="setLang">Català</a></li>
	            <li><a href="#" data-id="es" class="setLang">Castellano</a></li>
	            <li><a href="#" data-id="en" class="setLang">English</a></li>
	          </ul>
	        </li>-->

          </ul>

        </div>
      </div>
    </nav>	

    <div id="wrapper">
    	
        <!-- Sidebar -->
        <div id="sidebar-wrapper">
			<div id="accordion" role="tablist" aria-multiselectable="true">
				<div class="panel panel-default">
					<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
								<div class="panel-heading" role="tab" id="headingOne">
								  <h4 class="panel-title">Filters</h4>
								</div>
					</a>
				  <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
					<div class="panel-body">
					  <div class="sidebar-nav" id="filters">
						<div id="circleFilter"></div>
						<div id="fvFilter"></div>
					  </div>
					</div>
				  </div>
				</div>
			  </div>
			
            <ul class="sidebar-nav" id="search">
        		<form class='form-inline' role='search'><div class='form-group' id='searchTaxon'><input id='taxon' class='form-control typeahead' data-provide='typeahead' placeholder='Taxon'></div></form><div id='noresults'>No results</div>
        	</ul>
			<ul class="sidebar-nav" id="menuTaxon"></ul>
        </div>
        <!-- /#sidebar-wrapper -->

        <!-- Page Content -->
        <div id="page-content-wrapper">
            <div id="map">
            	<div id="legends"></div>
				<div id="sliderContainer">
					<input id="slider" type="text" />
				</div>
				<div class="mapLoading"></div>
				<div id="toggleButton"><a href="#toggle-button" class="btn btn-default"><!-- Marc: borrar ">>" --></a></div>
            </div>
        </div>
        <!-- /#page-content-wrapper -->

    </div>
    <!-- /#wrapper -->
       
	<script src="js/config.js"></script>
	<script src="js/lib/requirejs/require.js" data-main="ui"></script>    

    
</body>

</html>
