$(document).ready(function(){
    let proizvodi = proizvodiUKorpi();

    if(!proizvodi.length)
    prikaziPraznuKorpu();
    
    else
    prikaziSadrzajKorpe();


});


function prikaziSadrzajKorpe(){
    let proizvodi = proizvodiUKorpi();
        $.ajax({
            url:"../data/proizvodi.json",
            method:"GET",
            dataType:"json",
            success:function(data){

                let nizProizvoda =[];

                data = data.filter(el=>{
                    for(let pro of proizvodi){
                        if(el.id == pro.id){
                            el.kolicina = pro.kolicina;
                            return true;
                        }
                    }
                    return false;
                });
            ispisTabele(data);
            konacnoCena(data);
            }
        });
    }

function ispisTabele(proizvodi){
    let ispis = `
    <table>
        <thead>
            <tr>
                <th>Redni broj</th>
                <th>Proizvod</th>
                <th>Naziv</th>
                <th>Cena</th>
                <th>Količina (kg)</th>
                <th>Ukupna cena</th>
                <th>Ukloni iz korpe</th>
            </tr>
        </thead>
    <body>
    `;
        for(let pro of proizvodi) {
            ispis += napraviRed(pro);
    }

    ispis +=`
    <tr><td colspan="6"></td><td id="konacno"></td></tr>
    </body>
    </table>`;

    $("#tabelaProizvodi").html(ispis);

    function napraviRed(proizvod){
        return `
        <tr>
            <td>${proizvod.id}</td>
            <td>
                <img src="../images/proizvodi/${proizvod.slika.src}" alt="${proizvod.slika.alt}" >
            </td>
            <td>${proizvod.naziv}</td>
            <td>${proizvod.cena.cena}din</td>
            <td>${proizvod.kolicina}</td>
            <td>${proizvod.cena.cena * proizvod.kolicina}din</td>
            <td>
                <div class="ukloni">
                    <div class=""><button id="btnUkloni" onclick='UkloniIzKorpe(${proizvod.id})'>Ukloni</button> </div>
                </div>
            </td>
        </tr>
        `;
    }
}

    function konacnoCena(proizvod){
        let pr = 0;
        proizvod.forEach(p => {
            pr += p.cena.cena * p.kolicina;
        });
        document.getElementById('konacno').innerHTML = "Konačno: "+ pr +"din";
    }


function prikaziPraznuKorpu(){
    $("#tabelaProizvodi").html("<h3>Korpa je prazna!</h3>");
}

function proizvodiUKorpi(){
    return JSON.parse(localStorage.getItem("proizvodi"));
}

function UkloniIzKorpe(id) {
    let proizvodi = proizvodiUKorpi();
    let filtrirano = proizvodi.filter(proizvod => proizvod.id != id);

    localStorage.setItem("proizvodi", JSON.stringify(filtrirano));

    prikaziSadrzajKorpe();
}

