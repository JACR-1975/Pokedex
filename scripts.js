class Pokedex {
    constructor() {
        this.pokemonData = [];
        this.searchInput = document.getElementById("searchInput");
        this.pokemonList = document.getElementById("pokemonList");
        this.modal = document.getElementById("modal");
        this.modalContent = document.getElementById("modalContent");
        this.init();
    }

    async init() {
        try {
            this.pokemonData = await this.fetchPokemonData();
            this.renderPokemonList();
            this.addEventListeners();
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }

    async fetchPokemonData() {
        const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100';
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data.results;
        } catch (error) {
            throw new Error('Error al cargar los datos');
        }
    }

    renderPokemonList() {
        const pokemonList = this.pokemonData.map((pokemon) => this.createPokemonCard(pokemon)).join("");
        this.pokemonList.innerHTML = pokemonList;
    }

    createPokemonCard(pokemon) {
        const types = pokemon.types ? pokemon.types.map((type) => type.type.name).join(", ") : "Unknown";
        return `
        <div class="pokemon-card" data-url="${pokemon.url}">
          <h2>${pokemon.name}</h2>
          <p>Type: ${types}</p>
        </div>
      `;
    }

    async fetchPokemonDetails(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('No se pudo obtener la información del Pokémon');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener los detalles del Pokémon:', error);
            return null;
        }
    }

    async showModalDetails(pokemonUrl) {
        try {
            const pokemonDetails = await this.fetchPokemonDetails(pokemonUrl);
            if (pokemonDetails) {
                const types = pokemonDetails.types.map((type) => type.type.name).join(", ");
                const abilities = pokemonDetails.abilities.map((ability) => ability.ability.name).join(", ");
                const moves = pokemonDetails.moves.slice(0, 5).map((move) => move.move.name).join(", ");
                const imageUrl = pokemonDetails.sprites.front_default;
                const weight = pokemonDetails.weight;

                this.modalContent.innerHTML = `
            <h2>${pokemonDetails.name}</h2>
            <img src="${imageUrl}" alt="${pokemonDetails.name}">
            <p>Type: ${types}</p>
            <p>Weight: ${weight} kg</p>
            <p>Abilities: ${abilities}</p>
            <p>Moves: ${moves}</p>
          `;
                this.modal.style.display = "block";
            }
        } catch (error) {
            console.error("Error al cargar los detalles del pokémon:", error);
        }
    }

    addEventListeners() {
        const pokemonCards = document.querySelectorAll(".pokemon-card");
        pokemonCards.forEach((card) => {
            card.addEventListener("click", () => {
                const pokemonUrl = card.dataset.url;
                this.showModalDetails(pokemonUrl);
            });
        });

        this.searchInput.addEventListener("input", () => {
            const searchTerm = this.searchInput.value.toLowerCase();
            const filteredPokemon = this.pokemonData.filter((pokemon) => {
                return pokemon.name.toLowerCase().includes(searchTerm);
            });
            this.renderFilteredPokemonList(filteredPokemon);
        });

        this.modal.addEventListener("click", (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        this.modal.style.display = "none";
    }

    renderFilteredPokemonList(filteredPokemon) {
        const pokemonList = filteredPokemon.map((pokemon) => this.createPokemonCard(pokemon)).join("");
        this.pokemonList.innerHTML = pokemonList;
    }
}

const pokedex = new Pokedex();
