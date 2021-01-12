async function iniciar() {
    const url = "https://pokeapi.co/api/v2/pokemon/";

    let response = await fetch(url);

    if (response.status === 200) {
        let datos = await response.json();

        const { results: pokemones } = datos;

        mostrarListadoPokemones(pokemones);
    } else {
        alert("Algo salio mal");
    }
}

function mostrarListadoPokemones(pokemones) {
    const listadoPokemones = document.querySelector("#listado-pokemones");

    pokemones.forEach((pokemon) => {
        const { name, url } = pokemon;

        listadoPokemones.innerHTML += `
        <article class="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-6 mb-4">
                    <div
                        class="rounded-3 p-3"
                        style="background-color: #f0f0f0"
                    >
                        <div class="d-flex flex-column align-items-center">
                            <h4 class="mb-3 text-capitalize">${name}</h4>
                            <button class="btn btn-danger shadow-none detalle-pokemon" data-bs-toggle="modal" data-bs-target="#modal-detalle-pokemon" data-url="${url}">
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

    const {
        name,
        sprites: { front_default: imgPokemon },
        stats
    } = pokemon;

    img.setAttribute("src", `${imgPokemon}`);
    img.setAttribute("alt", `Imagen frontal del pokemon ${name}`);
    document.querySelector("#nombre").innerHTML = `${name}`;
    document.querySelector("#valor-hp").innerHTML = `${stats[0].base_stat}`;
    document.querySelector("#valor-ataque").innerHTML = `${stats[1].base_stat}`;
    document.querySelector(
        "#valor-defensa"
    ).innerHTML = `${stats[2].base_stat}`;
    document.querySelector(
        "#valor-velocidad"
    ).innerHTML = `${stats[5].base_stat}`;
    document.querySelector(
        "#valor-ataque-especial"
    ).innerHTML = `${stats[3].base_stat}`;
    document.querySelector(
        "#valor-defensa-especial"
    ).innerHTML = `${stats[4].base_stat}`;
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
