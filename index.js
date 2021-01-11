async function iniciar() {
    const url = "https://pokeapi.co/api/v2/pokemon/";

    let response = await fetch(url);

    if (response.status === 200) {
        let datos = await response.json();

        mostrarListadoPokemones(datos.results);
    } else {
        alert("Algo salio mal");
    }
}

function mostrarListadoPokemones(pokemones) {
    const listadoPokemones = document.querySelector("#listado-pokemones");

    pokemones.forEach((pokemon) => {
        listadoPokemones.innerHTML += `
        <article class="col-xl-3 mb-4">
                    <div
                        class="rounded-3 p-3"
                        style="background-color: #f0f0f0"
                    >
                        <div class="d-flex flex-column align-items-center">
                            <h4 class="mb-3 text-capitalize">${pokemon.name}</h4>
                            <button class="btn btn-danger shadow-none detalle-pokemon" data-bs-toggle="modal" data-bs-target="#modal-detalle-pokemon" data-url="${pokemon.url}">
                                Ver detalle
                            </button>
                        </div>
                    </div>
                </article>
        `;
    });

    document.querySelectorAll(".detalle-pokemon").forEach((btn) => {
        btn.addEventListener("click", mostrarModalDetalle);
    });
}

async function mostrarModalDetalle(e) {
    const url = e.currentTarget.getAttribute("data-url");
    const img = document.querySelector("#img");

    let pokemon = await cargarPokemon(url);
    console.log(pokemon);

    img.setAttribute("src", `${pokemon.sprites.front_default}`);
    img.setAttribute("alt", `Imagen frontal del pokemon ${pokemon.name}`);
    document.querySelector("#nombre").innerHTML = `${pokemon.name}`;
    document.querySelector(
        "#valor-hp"
    ).innerHTML = `${pokemon.stats[0].base_stat}`;
    document.querySelector(
        "#valor-ataque"
    ).innerHTML = `${pokemon.stats[1].base_stat}`;
    document.querySelector(
        "#valor-defensa"
    ).innerHTML = `${pokemon.stats[2].base_stat}`;
    document.querySelector(
        "#valor-velocidad"
    ).innerHTML = `${pokemon.stats[5].base_stat}`;
    document.querySelector(
        "#valor-ataque-especial"
    ).innerHTML = `${pokemon.stats[3].base_stat}`;
    document.querySelector(
        "#valor-defensa-especial"
    ).innerHTML = `${pokemon.stats[4].base_stat}`;
}

async function cargarPokemon(pokemon) {
    let response = await fetch(pokemon);

    if (response.status === 200) {
        let pokemon = await response.json();

        return pokemon;
    } else {
        alert("Algo salio mal");
    }
}

iniciar();
