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
                            <button class="btn btn-danger shadow-none" data-id="${pokemon.url}">
                                Ver detalle
                            </button>
                        </div>
                    </div>
                </article>
        `;
    });
}

iniciar();
