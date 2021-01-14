async function iniciar() {
    const TOTAL_POKEMONES = 900;

    let response = await cargarPokemones();

    if (response.status === 200) {
        let datos = await response.json();

        const { results: pokemones } = datos;

        mostrarListadoPokemones(pokemones);
        mostrarPaginador(TOTAL_POKEMONES);
    } else {
        alert("Algo salio mal");
    }
}

async function cambiarPagina(e) {
    e.preventDefault();

    const POKEMONES_POR_PAGINA = 20;
    let offset;
    let limit = POKEMONES_POR_PAGINA;
    const href = e.target.getAttribute("href");

    if (href === "#") {
        offset = POKEMONES_POR_PAGINA * Number(e.target.dataset.pagina);
    } else {
        const parametros = obtenerParametrosDeURL(href);

        offset = parametros.offset;
        limit = parametros.limit;
    }

    document.querySelector("#listado-pokemones").innerHTML = "";

    let response = await cargarPokemones(offset, limit);
    let datos = await response.json();

    const { results: pokemonesNuevos } = datos;
    mostrarListadoPokemones(pokemonesNuevos);
}

function crearItemPaginador(texto) {
    paginador.innerHTML += `
    <li class="page-item mb-3">
    <a class="page-link text-dark shadow-none" href="#" data-pagina="${texto}"
        >${texto}</a
    >
</li>
    `;
}

function mostrarPaginador(totalPokemones) {
    const POKEMONES_POR_PAGINA = 20;
    const totalPaginas = Math.ceil(totalPokemones / POKEMONES_POR_PAGINA);

    for (let i = 0; i < totalPaginas; i++) {
        const numeroPagina = i;

        crearItemPaginador(numeroPagina);
    }

    document.querySelectorAll("a").forEach((element) => {
        element.addEventListener("click", cambiarPagina);
    });
}

function obtenerParametrosDeURL(url) {
    let offset;
    let limit;

    try {
        offset = /offset=([0-9]+)/gi.exec(url).pop();
        limit = /limit=([0-9]+)/gi.exec(url).pop();
    } catch (e) {
        offset = undefined;
        limit = undefined;
    }

    return { offset, limit };
}

async function cargarPokemones(offset = 0, limit = 20) {
    let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
    );

    return response;
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
