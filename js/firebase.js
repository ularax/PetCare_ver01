//###############################################
// 必要なJSを読み込み
//###############################################
    import { initializeApp }
        from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
    import { getDatabase, ref, push, set, onValue, onChildAdded, remove, onChildRemoved }
        from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";
    import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
        from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";


//###############################################
//FirebaseConfig [ KEYを取得して設定！！ ]
//###############################################
const firebaseConfig = {
    apiKey: "***********************************",
    authDomain: "*******************************",
    databaseURL: "******************************",
    projectId: "********************************",
    storageBucket: "****************************",
    messagingSenderId: "************************",
    appId: "************************************",
};

const app = initializeApp(firebaseConfig);

//###############################################
//Firebase-RealtimeDatabase接続
//###############################################
const db  = getDatabase(app); //RealtimeDBに接続

//###############################################
//GoogleAuth用
//###############################################
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const auth = getAuth();

//###############################################
//Loginしていれば処理します
//###############################################
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = nBJE0LT9UZd3unyAuJsKodqpreh1; //自分のuser idを入れる
        //ユーザー情報取得できます
        if (user !== null) {
            user.providerData.forEach((profile) => {
                //Login情報取得
                // $("#uname").text(profile.displayName);
                // $("#prof").attr("src",profile.photoURL);
                // console.log("Sign-in provider: " + profile.providerId);
                // console.log("Provider-specific UID: " + profile.uid);
                // console.log("Email: " + profile.email);
                // console.log("Photo URL: " + profile.photoURL);
            });
            $("#status").fadeOut(500);
        }

        //データ登録(Click)
        $("#send").on("click",function() {
            console.log(送信);
            const msg = {
                petname: $("#petname").val(),
                num01:  $("#num01").val(),
                vets:  $("#vets").val()
            }
            const dbRef = ref( db, "users/"+uid+"/memo/"+$("#petname").val() ); //RealtimeDB内の"chat"を使う
            set(dbRef, msg);  //DBに値をセットする
        });

        //最初にデータ取得＆onSnapshotでリアルタイムにデータを取得
        $("#petname").on("change",function(){
            console.log(日付);
            const dbRef = ref( db, "users/"+uid+"/memo/"+$(this).val() ); //RealtimeDB内の"chat"を使う
            onValue(dbRef, function(data){
                const msg  = data.val();    //オブジェクトデータを取得し、変数msgに代入
                console.log(msg);
                // const key  = data.key;      //データのユニークキー（削除や更新に使用可能）
                $("num01").val(msg.text);
            });
        });

        //最初にデータ取得＆onSnapshotでリアルタイムにデータを取得
        $("#petname").on("change",function(){
            console.log(動物病院);
            const dbRef = ref( db, "users/"+uid+"/memo/"+$(this).val() ); //RealtimeDB内の"chat"を使う
            onValue(dbRef, function(data){
                const msg  = data.val();    //オブジェクトデータを取得し、変数msgに代入
                console.log(msg);
                // const key  = data.key;      //データのユニークキー（削除や更新に使用可能）
                $("vets").val(msg.text);
             });
        });

    } else {
        _redirect();  // User is signed out
    }
});


//###############################################
//Firestore接続
//###############################################
    import {
            getStorage,
            ref as sRef,
            uploadBytesResumable,
            getDownloadURL,
        } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";

    import {
            getFirestore,
            doc,
            getDoc,
            setDoc,
            collection,
            addDoc,
        } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
    const clouddb = getFirestore();

        // -----------------------------------------------

        let files = [];
        let reader = new FileReader();

        let namebox = document.getElementById("namebox");
        let extlab = document.getElementById("extlab");
        let myimg = document.getElementById("myimg");
        let proglab = document.getElementById("upprogress");
        let SelBtn = document.getElementById("selbtn");
        let UpBtn = document.getElementById("upbtn");
        let DownBtn = document.getElementById("downbtn");

        let input = document.createElement("input");
        input.type = "file";

        console.log(input);
        input.onchange = (e) => {
            console.log(e);
            files = e.target.files;

            let extension = GetFileExt(files[0]);
            let name = GetFileName(files[0]);

            namebox.value = name;
            extlab.innerHTML = extension;

            reader.readAsDataURL(files[0]);
        };

        reader.onload = function () {
            myimg.src = reader.result;
        };

        // ----------selection--------------
        SelBtn.onclick = function () {
            console.log(1111);
            input.click();
        };

        function GetFileExt(file) {
            let temp = file.name.split(".");
            let ext = temp.slice(temp.length - 1, temp.length);
            return "." + ext[0];
        }

        function GetFileName(file) {
            let temp = file.name.split(".");
            let fname = temp.slice(0, -1).join(".");
            return fname;
        }

        // -------------upload-------------------------

        async function UploadProcess() {
            let ImgToUpload = files[0];

            let ImgName = namebox.value + extlab.innerHTML;

            const metaData = {
                contentType: ImgToUpload.type,
            };
            const storage = getStorage();

            const storageRef = sRef(storage, "Images/" + ImgName);

            const UploadTask = uploadBytesResumable(
                storageRef,
                ImgToUpload,
                metaData
            );

            UploadTask.on(
                "state-changed",
                (snapshot) => {
                    let progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) *
                        100;
                    proglab.innerHTML = "Upload " + progress + "%";
                    console.log(snapshot);
                },
                (error) => {
                    alert("エラーです！アップロードできてません！！");
                },
                () => {
                    getDownloadURL(UploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            SaveURLtoFirestore(downloadURL);
                            console.log(downloadURL);
                        }
                    );
                }
            );
        }
        // --------------------------- functions for firestore database---------------------------

        // 非同期処理
        async function SaveURLtoFirestore(url) {
            let name = namebox.value;
            let ext = extlab.innerHTML;

            let ref = doc(clouddb, "ImageLinks/" + name);

            await setDoc(ref, {
                ImageName: name + ext,
                ImageURL: url,
            });
        }

        async function GetImagefromFirestore() {
            let name = namebox.value;

            let ref = doc(clouddb, "ImageLinks/" + name);

            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                myimg.src = docSnap.data().ImageURL;
            }
        }

        UpBtn.onclick = UploadProcess;
        DownBtn.onclick = GetImagefromFirestore;


//###############################################
//Logout処理
//###############################################
$("#out").on("click", function () {
    // signInWithRedirect(auth, provider);
    signOut(auth).then(() => {
        // Sign-out successful.
        _redirect();
    }).catch((error) => {
        // An error happened.
        console.error(error);
    });
});

//###############################################
//Login画面へリダイレクト(関数作成)
//###############################################
function _redirect(){
    location.href="login.html";
}



