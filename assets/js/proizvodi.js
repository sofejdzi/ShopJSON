$(document).ready(function(){
    $.ajax({
        url:"../data/proizvodi.json",
        method:"GET",
        dataType:"json",
        success:function(data){
          ispisProizvoda(data);
          PrikazAkcije(data);
        },
        error:function(err){
          console.error(err);
        }
      });

      function PrikazAkcije(data){
        $('#akcija').click(filtrirajAkcije);
            function filtrirajAkcije(e){
                e.preventDefault();
                var filterAkcija = data.filter(proizvod=>{
                if(proizvod.akcija != false)
                    return proizvod;
                });
                ispisProizvoda(filterAkcija);
            }
      }

      document.getElementById('btnPretraga').addEventListener('click', pretraga);
      function pretraga(){
        var pretrazi = document.getElementById('query').value;
        $.ajax({
          url:"../data/proizvodi.json",
          method:"GET",
          dataType:"json",
          success:function(data){
            var filtrirajProizvode = data.filter(proizvod=>{
              if(proizvod.naziv.toLowerCase().indexOf(pretrazi.toLowerCase())!==-1 || proizvod.opis.toLowerCase().indexOf(pretrazi.toLowerCase())!==-1)
                return proizvod;
            });
            ispisProizvoda(filtrirajProizvode);
          },
          error:function(err){
            console.error(err);
          }
      });
      }

      $.ajax({
        url:"../data/kategorije.json",
        method:"GET",
        dataType:"json",
        success:function(data){
          ispisKategorija(data);
        },
        error:function(err){
          console.error(err);
        }
      });

      function ispisKategorija(data){
        var ispis = "";
        data.forEach(kategorija=>{
          ispis += `<li><a href="#" class="button alt small" data-id="${kategorija.id}">${kategorija.naziv}</a></li>`;
        });
       document.getElementById('kategorije').innerHTML = ispis;
       prikazKategorija();
      }

      function prikazKategorija(){
        $('#kategorije li a').click(FiltrirajKategorije);
        function FiltrirajKategorije(e){
          e.preventDefault();
          var idKat = this.dataset.id;
          $.ajax({
            url:"../data/proizvodi.json",
            method:"GET",
            dataType:"json",
            success:function(data){
              var filterKategorije = data.filter(proizvod=>{
                return proizvod.kategorija.some(kat=>{
                  if(kat.id == idKat){
                    return kat;
                  }
                });
              });
              ispisProizvoda(filterKategorije);
            },
            error:function(err){
              console.error(err);
            }
        });
      }
    }

      var brojac=0;
        $('#kategorije').hide();
        $('#kat').click(function(e){
          e.preventDefault();
          if(brojac%2 == 0){
            $('#katStrelica').html('<i class="fas fa-angle-up"></i>');
            }
            else{
              $('#katStrelica').html('<i class="fas fa-angle-down"></i>');
            }
          $('#kategorije').slideToggle();
          brojac++;
        });


      function ispisProizvoda(data){
          var ispis="";
          data.forEach(proizvod=>{
            ispis+=`<div class="4u">
            <div class="slika">`
                if(proizvod.akcija!=false){
                    ispis+=`<a href=# class="akcija"><i class="fas fa-percent"></i></a>`;
                }
            ispis+=`<img src="../images/proizvodi/${proizvod.slika.src}" alt="${proizvod.slika.alt}">
            </div>
            <div class="cleaner"></div>
            <div class="naslov">
                <h3>${proizvod.naziv}</h3>
                <p>${proizvod.opis}</p>
                 <p>Kategorije: `;
                 proizvod.kategorija.forEach((el, i)=>{
                   i==0? ispis+=el.naziv : ispis+=', ' + el.naziv
                 })
                 ispis+=`</p>
            </div>
            <div class="cene">`
            if(proizvod.akcija!=false){
                ispis+=`<p class="staraCena"><del>${proizvod.cena.staraCena} din/kg</del></p>
                <p class="cena"><span>${proizvod.cena.cena} din/kg</span></p>`;
            }else{
                ispis+=`<p><span>${proizvod.cena.cena} din/kg</span></p>`;
            }
            ispis+=`</div>
            <input type="button" id="btnDodaj" class="dodaj" data-id="${proizvod.id}" value="Dodaj u korpu"/>
        </div>`;
          });
          document.getElementById('proizvodi').innerHTML = ispis;
          korpa();
      }

      document.getElementById('sve').addEventListener('click', function(e){
        e.preventDefault();
        $.ajax({
          url:"../data/proizvodi.json",
          method:"GET",
          dataType:"json",
          success:function(data){
            ispisProizvoda(data);
          },
          error:function(err){
            console.error(err);
          }
        });
      });

      document.getElementById('sortiraj').addEventListener('change', sortiranje);
      function sortiranje(){
        var izabrano = document.getElementById('sortiraj').options[document.getElementById('sortiraj').selectedIndex].value;
      
       $.ajax({
          url:"../data/proizvodi.json",
          method:"GET",
          dataType:"json",
          success:function(data){
    
            if(izabrano == "sort"){
              ispisProizvoda(data);
            }
    
            if(izabrano == "a-z"){
              data.sort(function(a,b){
                if(a.naziv > b.naziv)
                  return 1;
                
                if(a.naziv < b.naziv)
                  return -1;
    
                else
                  return 0;
              });
              ispisProizvoda(data);
            }
    
            if(izabrano == "z-a"){
              data.sort(function(a,b){
                if(a.naziv > b.naziv)
                  return -1;
                
                if(a.naziv < b.naziv)
                  return 1;
    
                else
                  return 0;
              });
              ispisProizvoda(data);
            }
    
          if(izabrano == "low-high"){
            data.sort(function(a,b){
              if(a.cena.cena > b.cena.cena)
                return 1;
              if(a.cena.cena < b.cena.cena)
                return -1;
              else  
                return 0;
            });
            ispisProizvoda(data);
          }
    
          if(izabrano == "high-low"){
            data.sort(function(a,b){
              if(a.cena.cena > b.cena.cena)
                return -1;
              if(a.cena.cena < b.cena.cena)
                return 1;
              else  
                return 0;
            });
            ispisProizvoda(data);
          }
        
        },
          error:function(err){
            console.error(err);
          }
        });
    
      }
     
      

    function korpa(){
      $(".dodaj").click(dodajUKorpu);
    }

    function proizvodiUKorpi(){
      return JSON.parse(localStorage.getItem("proizvodi"));
    }

    function dodajUKorpu(){
      let id = $(this).data("id");
      var proizvodi = proizvodiUKorpi();

      if(proizvodi){
          if(ProizvodJeVecUKorpi())
          azurirajKolicinu();
          else{
              DodajULocalStorage();
          }
      }
      else{
          dodajPrviProizvodULocalStorage();
      }
      $('#prozor').slideDown();
      $('#nastavi').click(function(e){
        e.preventDefault()
        $('#prozor').slideUp();
      })
      $('#zatvori a').click(function(e){
        e.preventDefault()
        $('#prozor').slideUp();
      
      })

    function azurirajKolicinu(){
      let proizvodi = proizvodiUKorpi();
      for(let i in proizvodi){
          if(proizvodi[i].id==id){
              proizvodi[i].kolicina++;
              break;
          }
          
      }
      localStorage.setItem("proizvodi",JSON.stringify(proizvodi))
    }

    function ProizvodJeVecUKorpi(){
      return proizvodi.filter(p => p.id == id).length;
    }

    function DodajULocalStorage(){
      let proizvodi = proizvodiUKorpi();

      proizvodi.push({
          id : id,
          kolicina :  1
      });
      localStorage.setItem("proizvodi", JSON.stringify(proizvodi));
    }

    function dodajPrviProizvodULocalStorage(){
      let proizvodi = [];
      proizvodi[0] = {
          id : id,
          kolicina : 1
      }
      localStorage.setItem("proizvodi",JSON.stringify(proizvodi));
    }
  }

});