const listadoPokemones = document.querySelector("#listado-pokemones");
let urlAnterior;
let urlSiguiente;
let paginaActual = 0;

async function iniciar() {
    const TOTAL_POKEMONES = 900;

    let response = await cargarPokemones();

    if (response.status === 200) {
        let datos = await response.json();

        const { results: pokemones, previous, next } = datos;

        urlAnterior = previous;
        urlSiguiente = next;

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
    paginaActual = e.target.dataset.pagina;
    const itemPaginadorAnterior = document.querySelector(
        "#item-paginador-anterior"
    );

    document.querySelectorAll(".item-paginador").forEach((element) => {
        if (element.dataset.pagina === paginaActual) {
            element.classList.add("bg-danger", "text-white");
        } else {
            element.classList.remove("bg-danger", "text-white");
        }
    });

    if (href === "#") {
        offset = POKEMONES_POR_PAGINA * Number(e.target.dataset.pagina);
    } else {
        const parametros = obtenerParametrosDeURL(href);

        offset = parametros.offset;
        limit = parametros.limit;
    }

    limpiarPantalla(listadoPokemones);

    let response = await cargarPokemones(offset, limit);
    let datos = await response.json();

    const { results: pokemonesNuevos, previous, next } = datos;

    urlAnterior = previous;
    urlSiguiente = next;

    if (urlAnterior === null) {
        itemPaginadorAnterior.classList.add("d-none");
    } else {
        itemPaginadorAnterior.classList.remove("d-none");
    }

    mostrarListadoPokemones(pokemonesNuevos);
}

async function cambiarPaginaAnterior(e) {
    e.target.setAttribute("data-url", `${urlAnterior}`);
    urlAnterior = e.target.getAttribute("data-url");
    const itemPaginadorAnterior = document.querySelector(
        "#item-paginador-anterior"
    );

    document.querySelectorAll(".item-paginador").forEach((element) => {
        if (element.classList.contains("bg-danger")) {
            paginaActual = Number(element.dataset.pagina - 1);

            element.classList.remove("bg-danger", "text-white");
        }

        if (element.dataset.pagina == paginaActual) {
            element.classList.add("bg-danger", "text-white");
        }
    });

    limpiarPantalla(listadoPokemones);

    let response = await fetch(urlAnterior);
    let datos = await response.json();

    const { results, previous, next } = datos;

    urlAnterior = previous;
    urlSiguiente = next;

    if (urlAnterior === null) {
        itemPaginadorAnterior.classList.add("d-none");
    } else {
        itemPaginadorAnterior.classList.remove("d-none");
    }

    mostrarListadoPokemones(results);
}

async function cambiarPaginaSiguiente(e) {
    e.target.setAttribute("data-url", `${urlSiguiente}`);
    urlSiguiente = e.target.getAttribute("data-url");
    const itemPaginadorAnterior = document.querySelector(
        "#item-paginador-anterior"
    );

    document.querySelectorAll(".item-paginador").forEach((element) => {
        if (element.classList.contains("bg-danger")) {
            paginaActual = Number(element.dataset.pagina) + 1;

            element.classList.remove("bg-danger", "text-white");
        }

        if (element.dataset.pagina == paginaActual) {
            element.classList.add("bg-danger", "text-white");
        }
    });

    limpiarPantalla(listadoPokemones);

    let response = await fetch(urlSiguiente);
    let datos = await response.json();

    const { results, previous, next } = datos;

    urlAnterior = previous;
    urlSiguiente = next;

    if (urlAnterior === null) {
        itemPaginadorAnterior.classList.add("d-none");
    } else {
        itemPaginadorAnterior.classList.remove("d-none");
    }

    mostrarListadoPokemones(results);
}

function limpiarPantalla(listadoPokemones) {
    listadoPokemones.innerHTML = "";
}

function crearItemPaginador(texto) {
    paginador.innerHTML += `
    <li class="page-item mb-3 d-md-block d-none">
    <a class="page-link text-dark shadow-none item-paginador" href="#" data-pagina="${texto}"
        >${texto + 1}</a
    >
</li>
    `;
}

function crearItemAnteriorSiguiente(texto, id) {
    paginador.innerHTML += `
    <li class="page-item mb-3">
    <a class="page-link text-dark shadow-none" href="#" id="${id}" data-url=""
        >${texto}</a
    >
</li>
    `;
}

function mostrarPaginador(totalPokemones) {
    const POKEMONES_POR_PAGINA = 20;
    const totalPaginas = Math.ceil(totalPokemones / POKEMONES_POR_PAGINA);

    crearItemAnteriorSiguiente("Anterior", "item-paginador-anterior");

    if (urlAnterior === null) {
        document
            .querySelector("#item-paginador-anterior")
            .classList.add("d-none");
    }

    for (let i = 0; i < totalPaginas; i++) {
        const numeroPagina = i;

        crearItemPaginador(numeroPagina);

        if (numeroPagina === 0) {
            document
                .querySelector(".item-paginador")
                .classList.add("bg-danger", "text-white");
        }
    }

    crearItemAnteriorSiguiente("Siguiente", "item-paginador-siguiente");

    document.querySelectorAll(".item-paginador").forEach((element) => {
        element.addEventListener("click", cambiarPagina);
    });

    document
        .querySelector("#item-paginador-anterior")
        .addEventListener("click", cambiarPaginaAnterior);

    document
        .querySelector("#item-paginador-siguiente")
        .addEventListener("click", cambiarPaginaSiguiente);
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
                            <img src="" alt="Imagen frontal del pokemon ${name}" id="img-listado-pokemones" data-url="${url}">
                            <h4 class="mb-3 text-capitalize">${name}</h4>
                            <button class="btn btn-danger shadow-none detalle-pokemon mb-3" data-bs-toggle="modal" data-bs-target="#modal-detalle-pokemon" data-url="${url}">
                                Ver detalle
                            </button>
                        </div>
                    </div>
                </article>
        `;
    });

    cargarImgPokemones();

    document.querySelectorAll(".detalle-pokemon").forEach((btn) => {
        btn.addEventListener("click", mostrarModalDetalle);
    });
}

function cargarImgPokemones() {
    document.querySelectorAll("#img-listado-pokemones").forEach((img) => {
        const urlPokemon = img.getAttribute("data-url");

        cargarPokemon(urlPokemon).then((pokemon) => {
            const {
                sprites: { front_default: imgPokemon }
            } = pokemon;

            img.src = imgPokemon;
        });
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
