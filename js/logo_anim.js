
const logoButton = document.getElementById("settingicon");

const mainLogo = document.getElementById("mainlogotype_anim");

const pendant = document.getElementById("pendant_anim");

const titleLogo = document.getElementById("titlelogo_anim");

const logoBase = document.getElementById("logo_base_anim");


function logo_anim(){

    mainLogo.classList.add("logo_center_position");
    pendant.classList.add("pull");
    titleLogo.style.opacity = 0;
    //divに中心へワープするクラスを追加、紐を引くクラスを追加、ロゴの不透明度を0に

    pendant.addEventListener("animationend" , (e) =>{
        if (e.animationName === "pull"){
            titleLogo.classList.add("flash");
            pendant.classList.remove("pull");
        }
    });
    //紐を引くアニメーションがおわったら紐のクラスを削除、ロゴの点滅クラスを追加

    titleLogo.addEventListener("animationend" , (e) =>{
        if (e.animationName === "flash"){
            mainLogo.classList.add("move");
            titleLogo.classList.remove("flash");
        }
    });
    //点滅がおわったらロゴのクラスを削除、全体のdivの移動クラスを追加

    mainLogo.addEventListener("animationend" , (e) =>{
        if (e.animationName === "move"){
            mainLogo.classList.remove("move");
            mainLogo.classList.remove("logo_center_position");
        }

    titleLogo.style.opacity = 1;

    //移動がおわったらdivのクラスを削除、ロゴののdivワープのクラスを削除、不透明度を100％に

    });
}



logoButton.addEventListener("click",logo_anim);