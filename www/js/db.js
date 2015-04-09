var db;

/* Query the Random List Recepe  */

function onRecipeHome(){
	
	// Wait for PhoneGap to load
    //
	document.addEventListener("deviceready", onDeviceReady, false);

	// PhoneGap is ready
    //
	function onDeviceReady() {
		
		
		document.addEventListener("backbutton", showConfirm, false);
		
		var firstrun = window.localStorage.getItem("dbCreated"); 

    	db = window.openDatabase("ResepkuDB", "1.0", "Resepku App", 200000);
    	
		if(firstrun == 1){
    		
			db.transaction(getHomeDB, transaction_error);
		
		}else{
		
			window.localStorage.setItem("dbCreated", "1"); 
    		db.transaction(populateDB, transaction_error, populateDB_success);
		}
	}	

	// Get alert exit app
	//
 	function showConfirm() {
        navigator.notification.confirm(
            'Do you really want to exit?',  // message
            exitFromApp,              		// callback to invoke with index of button pressed
            'Exit',            				// title
            'Cancel,OK'        				// buttonLabels
        );
    }
 
    // Get exit app
	//
    function exitFromApp(buttonIndex) {
      if (buttonIndex==2){
       navigator.app.exitApp();
    	}
	}
	
	// Transaction error callback
    //
	function transaction_error(tx, error) {
		$('#busy').hide();
    	alert("Database Error: " + error);
	}
	
	// Transaction success callback
    //
	function populateDB_success() {
		dbCreated = true;
    	db.transaction(getHomeDB, transaction_error);
	}
	
	// Random query database
	//
	seed = (Math.random() + 1) * 1111111;
	
	// Select the database
    //
	function getHomeDB(tx) {
		var sql = "SELECT id, category, name, image, summary, ingredients, directions, bookmark FROM recipe ORDER BY id * ? % 10000 LIMIT 5";
		tx.executeSql(sql, [seed], getHomeDB_success);
	}
	
	// Query the database
    //
	function getHomeDB_success(tx, results) {
		$('#busy').hide();
   		var len = results.rows.length;
    	for (var i=0; i<len; i++) {
    		var recipe = results.rows.item(i);
			$('#horizontalScroller ul').append('<li>'+
													'<a href="#details" class="getDeatil" data-transition="slide" rel="'+recipe.id+'">'+
       												'<div class="home-container img-shadow">'+
													'<div class="title-menu">'+ recipe.name +'</div>'+
													'<img src="img/bg_home_title.png" border="0" class="img-menu">'+
													'<img src="img/thumb/'+ recipe.image +'" width="250px" height="200px" />'+
													'</div>'+
													'</a>'+
												'</li>');
    	}

		db = null;
	}
}

/* Query the List Recepe  */

function onRecipeList(){

	document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {
    		
			db = window.openDatabase("ResepkuDB", "1.0", "Resepku App", 200000);
			db.transaction(getListDB, transaction_error);

		}	

		function transaction_error(tx, error) {
			$('#busy').hide();
    		alert("Database Error: " + error);
		}

		function getListDB(tx) {
			var sql = "SELECT id, category, name, image, summary, ingredients, directions, bookmark FROM recipe";
			tx.executeSql(sql, [], getListDB_success);
		}

		function getListDB_success(tx, results) {
			$('#busy').hide();
   			var len = results.rows.length;
    		for (var i=0; i<len; i++) {
    			var recipe = results.rows.item(i);
				
				$('#content-list-menu ul').append('<li>'+
													'<a href="#details" class="getDeatil" rel="'+recipe.id+'">'+
        												'<img border="0" src="img/thumb/'+ recipe.image +'">'+
        												'<h2>'+ recipe.name +'</h2>'+
        												'<p>'+ recipe.category +'</p>'+
													'</a>'+
    											'</li>').listview('refresh');
	
    		}

		db = null;
		}
}

/* Get Detail Recepe */

$(document).on('click', '.getDeatil', function() {
	
	var id = $(this).attr('rel');

	document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {
    		
			db = window.openDatabase("ResepkuDB", "1.0", "Resepku App", 200000);
			db.transaction(getDetailDB, transaction_error);

		}	

		function transaction_error(tx, error) {
			$('#busy').hide();
    		alert("Database Error: " + error);
		}


		function getDetailDB(tx) {
			var sql = "SELECT id, category, name, image, summary, ingredients, directions, bookmark FROM recipe WHERE id="+id;
			
			tx.executeSql(sql, [], getDetailDB_success);
		}

		function getDetailDB_success(tx, results) {
			$('#busy').hide();
   			var len = results.rows.length;
    		for (var i=0; i<len; i++) {
    			var recipe = results.rows.item(i);
				$('#name').html(recipe.name);
				$('#image').html('<img src="img/thumb/'+ recipe.image +'" width="250px" height="200px" />');
				$('#summary').html(recipe.summary);
				$('#directions').html(recipe.directions);
				$('#ingredients').html(recipe.ingredients);
				$('#btn-bookmarks').html('<a href="#" class="addBookmark" rel="'+recipe.id+'"><img src="img/btn_bookmark.png" border="0"></img></a>'); 
    		}

		db = null;
		}
});

/* Query the Bookmark Recepe */

$(document).on('click', '#onRecipeBookmark', function() {
													  
	
	// Clear content	
	//
	$('#content-bookmark ul').empty();

	document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {
    		
			db = window.openDatabase("ResepkuDB", "1.0", "Resepku App", 200000);
			db.transaction(getBookmarkDB, transaction_error);
			
		}	

		function transaction_error(tx, error) {
			$('#busy').hide();
    		alert("Database Error: " + error);
		}

		function populateDB_success() {
			dbCreated = true;
			db.transaction(getBookmarkDB, transaction_error);
		}
		
		// Query the database
		//
		function getBookmarkDB(tx) {
			var sql = "SELECT id, category, name, image, summary, ingredients, directions, bookmark FROM recipe WHERE bookmark = 1";
			tx.executeSql(sql, [], getBookmarkDB_success);
		}

		function getBookmarkDB_success(tx, results) {
			$('#busy').hide();
   			var len = results.rows.length;
    		for (var i=0; i<len; i++) {
    			var recipe = results.rows.item(i);
				$('#content-bookmark ul').append('<li>'+
													'<a href="#details" class="getDeatil" rel="'+recipe.id+'">'+
        												'<img border="0" src="img/thumb/'+ recipe.image +'">'+
        												'<h2>'+ recipe.name +'</h2>'+
        												'<p>'+ recipe.category +'</p>'+
													'</a>'+
    											'</li>').listview('refresh');
    		}

		db = null;
		}
});

/* Add Bookmark Recepe */

$(document).on('click', '.addBookmark', function() {
										
	var id = $(this).attr('rel');


	document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {
    		
			db = window.openDatabase("ResepkuDB", "1.0", "Resepku App", 200000);
			db.transaction(getItemBookmarkDB, transaction_error);
		}	

		function transaction_error(tx, error) {
			$('#busy').hide();
    		alert("Database Error: " + error);
		}


		function getItemBookmarkDB(tx) {
			
			var sql = "UPDATE recipe SET bookmark = 1 WHERE id ="+id;
			
			tx.executeSql(sql, [], getItemBookmarkDB_success);
		}

		function getItemBookmarkDB_success(tx, results) {
			$('#busy').hide();
   			alert("Bookmark Success");
		}
});

onRecipeHome();
onRecipeList();




// Populate the database 
//
function populateDB(tx) {
	$('#busy').show();
	tx.executeSql('DROP TABLE IF EXISTS recipe');
	tx.executeSql('CREATE TABLE IF NOT EXISTS recipe (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL, name TEXT NOT NULL, image TEXT NOT NULL, summary TEXT NOT NULL, ingredients TEXT NOT NULL, directions TEXT NOT NULL, bookmark TEXT NOT NULL)');

// Add Recipes Data (sample data)
//
    tx.executeSql("INSERT INTO recipe (id, category, name, image, summary, ingredients, directions, bookmark) VALUES (1,'Category Vegetable','Tahu Gimbal Semarang','1.jpg','Santapan nikmat khas semarang yang mampu menggoyang lidah, hmm..sedap!','<ul><li>Tahu pong 8 buah.</li><li>Telur ayam 4 butir, rebus, kupas.</li><li>Tauge panjang 100 gram, seduh dengan air hangat.</li><li>Bawang goreng 2 sendok makan.</li><li>Garam 1 sendok makan.</li><li>Minyak goreng secukupnya.</li><li>Tepung terigu protein sedang 125 gram.</li><li>Bawang putih 2 siung, haluskan.</li><li>Udang 100 gram, buang kulit dan kepalanya.</li><li>Merica bubuk 1 sendok teh.</li><li>Garam secukupnya.</li><li>Air 200 ml.</li><li>Bawang putih 2 siung, haluskan.</li><li>Cabe rawit hijau 10 buah, haluskan.</li><li>Petis udang 4 sendok makan.</li><li>Kecap manis 2 sendok makan.</li><li>Gula merah 1 sendok makan.</li><li>Garam secukupnya.</li><li>Air 300 ml.</li><li>Minyak goreng 2 sendok makan</li></ul>','<ol><li>Goreng tahu dan telur secara terpisah hingga kering, tiriskan. Tahu dipotong dadu dan telur dibelah 2.</li><li>Gimbal udang : campur tepung bersama bawang putih, merica dan garam, aduk rata, tuang air sedikit demi sedikit hingga adonan kental. Tuang 1 sendok sayur adonan,taruh udang di atasnya. Dan goreng hingga matang, angkat dan tiriskan.</li><li>Bumbu petis : panaskan minyak, tumis bawang putih hingga harum, masukkan cabe rawit,petis, kecap manis, gula merah, garam, tuang air dan masak hingga mendidih, angkat.</li><li>Letakkan tahu pong dalam piring saji, tambahkan gimbal udang, tauge dan telur goreng, tambahkan bumbu petis dan taburi bawang goreng. Sajikan</li></ol>',0)");
	
	tx.executeSql("INSERT INTO recipe (id, category, name, image, summary, ingredients, directions, bookmark) VALUES (2,'Category Vegetable','Es Pisang Ijo','2.jpg','rahasia hijau ada di balutannya yang persis pisang molen, namun tepung diwarnai warna ijo dari daun suji dan pewarna makanan','<ul><li>5 buah pisang raja yang cukup tua</li><li>40 gram tepung beras</li><li>175 gram tepung beras</li><li>1/2 sendok teh garam</li><li>100 ml air daun suji</li><li>3 tetes pewarna hijau</li><li>300 ml air bersih</li><li>Secukupnya es serut</li><li>Secukupnya sirup merah</li><li>50 gram tepung terigu</li><li>75 gram gula pasir</li><li>650 ml santan</li><li>1 lembar daun pandan</li><li>1/4 sendok teh garam </li></ul>','<ol><li>Pertama campurkan tepung beras, garam, air bersih, air daun suji, juga pewarna hijau lalu rebus sambil diaduk sampai mendidih, angkat.</li><li>Kemudian Tambahkan tepung beras, aduk sampai kalis.</li><li>Tipiskan adonan, balutkan pada pisang hingga tertutup.</li><li>Lalu Kukus pisang selama 20 menit. Angkat dan sisihkan.</li><li>Campurkan semua bahan saus lalu rebus sampai mendidih, angkat lalu dinginkan.selesai</li></ol>',0)");
	
    tx.executeSql("INSERT INTO recipe (id, category, name, image, summary, ingredients, directions, bookmark) VALUES (3,'Category Vegetable','Bolu Kukus','3.jpg','Rasa kue ini tentu sangat enak, setelah dicoba cukup juga dan pada suka loh sama resep ini. empuk, manis dan gurih terasa semua.','<ul><li>3 butir telur</li><li>300 gram gula pasir</li><li>225 cc air bersih</li><li>15 gram SP</li><li>300 gram terigu merk apa saja</li><li>10 gram custard powder</li><li>10 gram susu bubuk</li></ul>','<ol><li>Pertama Kocok telur dan gula kurang lebih selama 2 menit</li><li>masukkan custard powder, SP, susu bubuk, dan terigu berselang-seling dengan air</li><li>Kemudian Kocok terus hingga kira-kira 6 menitan</li><li>Lalu Istirahatkan kurang lebih 12 menitan</li><li>Terakhir Kukus 15 menit, selesai</li></ol>',0)");
	
    tx.executeSql("INSERT INTO recipe (id, category, name, image, summary, ingredients, directions, bookmark) VALUES (4,'Category Vegetable','Rainbow Cake','4.jpg','Pelangi Kukus. Kue ini sangat digemari dan digangrungi banyak orang','<ul><li>200 gram tepung terigu</li><li>8 butir telur</li><li>300 gram gula pasir</li><li>300 ml minyak goreng</li><li>1/2 sendok teh vanili bubuk</li><li>1 sendok teh emulsifier</li><li>1/2 sendok teh garam</li><li>Secukupnya pewarna makanan (merah, jingga, kuning, hijau, biru, ungu)</li></ul>','<ol><li>Pertama Kocok 8 butir telur dan 300 gram gula pasir sampai tercampur rata dan halus menggunakan mixer.</li><li>Lalu masukkan 1 sendok teh emulsifier, 1/2 sendok teh Vanili bubuk dan 1/2 sendok teh garam. Kocok sampai mengembang, selesai, matikan mixer.</li><li>kemudian ambil sedikit adonan diatas lalu letakkan pada mangkuk kecil, campurkan minyak goreng, aduk sampai tercampur rata, sisihkan.</li><li>Masukkan 200 gram tepung terigu sedikit demi sedikit, aduk sampai tercampur rata.</li><li>Masukkan campuran adonan yang telah diberi minyak, dan aduk hingga rata.</li><li>Bagi adonan jadi 6 bagian pada wadah yang berbeda, kemudian masing-masing adonan beri pewarna makanan.</li><li>Gunakan loyang ukuran 24 x 12 cm (atau sesuai keinginan), lapisi dengan kertas roti, beri olesan mentega tipis, baru tuang adonan ke dalamnya.</li><li>Kukus adonan loyang selama 20 menit, angkat, dinginkan.</li><li>Beri alas berupa kertas roti atau plastik lebar pada bagian bawah meja atau tempat yang Anda pakai untuk menyusun setiap adonan.</li><li>Susun adonan dengan warna yang di inginkan sesuai selera. Beri olesan buttercream tipis pada setiap lapisannya.</li><li>Bila sudah tersusun lalu tutupi semua bagian bolu dengan sisa buttercream.selesai</li></ol>',0)");
	
    tx.executeSql("INSERT INTO recipe (id, category, name, image, summary, ingredients, directions, bookmark) VALUES (5,'Category Vegetable','Coto Makassar','5.jpg','Asli Enak dan nikmat. itulah gambaran betapa masakan tradisional ini begitu memikat','<ul><li>1 kg daging sapi bagian paha atau apa saja</li><li>2 liter air cucian beras putih</li><li>5 batang serai, dimemarkan dulu</li><li>5 lembar daun salam</li><li>250 gram kacang tanah, goreng, tumbuk, dan haluskan.</li><li>3 sendok makan minyak goreng, untuk menumis</li><li>5 cm jahe, memarkan</li><li>1 ruas lengkuas, dimemarkan dulu</li><li>8 butir kemiri disangrai dulu </li><li>10 siung bawang putih </li><li>1 sendok makan ketumbar, disangrai dulu </li><li>1 sendok teh jintan, disangrai dulu </li><li>1 sendok makan garam </li><li>1 sendok teh merica butiran.</li> <li>Bawang goreng garing Irisan daun bawang segar </li><li>Irisan seledri segar</li></ul>','<ol><li>Pertama rebus daging sapi bersama air cucian beras, serai, lengkuas, jahe, dan daun salam sampai empuk (lebih bagus pake presto), lalu potong-potong dadu,tiriskan.air rebusannya (kaldu) jangan dibuang. Optional : Jika ada jeroan, (hati,jantung dll) harap direbus dengan air biasa dan ditempat terpisah.</li><li>Kemudian Panaskan minyak goreng, tumis bumbu yang dihaluskan diatas hingga harum.</li><li>Bumbu yang sudah ditumis tersebut kemudian dimasukkan ke dalam kaldu panaskan lagi, tambahkan kacang tanah goreng yang sudah dihaluskan, kemudian tunggu sampai mendidih.</li></ol>',0)");

    tx.executeSql("INSERT INTO recipe (id, category, name, image, summary, ingredients, directions, bookmark) VALUES (6,'Category Vegetable','Rendang Padang','6.jpg','Asli Enak dan gurih. Masakan rendang padang sudah sangat terkenal enak dan pedas','<ul><li>1 1/2 kg daging sapi segar</li><li>12 gelas santan dari 3 butir kelapa yang tua</li><li>2 biji asam kandis</li><li>2 lembar daun jeruk purut</li><li>1 batang serai, dimemarkan dulu</li><li>1 lembar daun kunyit</li><li>Garam secukupnya</li><li>1 ons cabe merah segar</li><li>15 buah bawang merah</li><li>6 siung bawang putih</li><li>5 buah Kemiri</li><li>2 cm Jahe</li><li>3 cm laos, digeprek saja</li></ul>','<ol><li>Pertama Daging dipotong potong sesuai selera.</li><li>Ambil wajan rebus santan dengan bumbu-bumbu yang sudah dihaluskan tadi, masukan juga daun-daunan dan asam kandis.</li><li>Aduk Aduk terus sampai mengental supaya si santan tidak pecah. Jika sudah mulai mengeluarkan minyak, silahkan masukan potongan daging</li><li>Aduk aduk terus jangan berhenti diatas api sedang saja. proses sampai daging empuk. Selesai</li></ol>',0)");
	
}