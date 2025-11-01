<script lang="ts">
    import "../app.css";
    import axios from "axios";
    import SvelteMarkdown from "@humanspeak/svelte-markdown";

    let backendUrl = "/api";

    let language: string = "english";
    let roastingResult: string = "";
    let isLoading = false;

    let isCustomSelectOpen = false;
    let selectedOfficialValue = null;
    let searchTerm = "";
    let officialProfile = null;

    let loadingGetPejabat = false;
    // Data untuk dropdown
    let officialOptions = [];

    function getInitials(fullName) {
        const nameParts = fullName.split(" ");
        const initialsArray = nameParts.map((part) => {
            if (part.length > 0) {
                return part[0].toUpperCase();
            }
            return "";
        });
        return initialsArray.join("");
    }

    const getPejabat = async () => {
        loadingGetPejabat = true;
        try {
            const response = await axios.get(`${backendUrl}/kabinet`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.data;

            for (const pejabat of data) {
                if (
                    !officialOptions.find(
                        (option) => option.value === pejabat.nama_pejabat,
                    )
                ) {
                    officialOptions.push({
                        value: pejabat.nama_pejabat,
                        text: pejabat.nama_pejabat,
                        jabatan: pejabat.jabatan,
                        imageUrl:
                            pejabat.foto_url != null
                                ? `https://images.veryfront.com/imgproxy/q:75/${btoa(pejabat.foto_url)}.${pejabat.foto_url.split(".").pop()}`
                                : "https://placehold.co/40x40/60a5fa/ffffff?text="+getInitials(pejabat.nama_pejabat),
                    });
                }
            }
            officialOptions = officialOptions.sort((a, b) =>
                a.text.localeCompare(b.text),
            );
        } catch (error) {
            console.error("Error fetching pejabat:", error);
        } finally {
            loadingGetPejabat = false;
        }
    };

    async function getProfilPejabat(nama) {
        isLoading = true;
        const response = await axios.get(`${backendUrl}/profil?nama=${nama}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.data;
        return data;
    }

    async function roastOfficial() {
        isLoading = true;
        try {
            const officialInfo = await getProfilPejabat(selectedOfficialValue);

            const response = await axios.post(
                `${backendUrl}/roasting`,
                {
                    language: language,
                    officialInfo: officialInfo,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            officialProfile = officialInfo;
            const data = await response.data;
            roastingResult = data.roasting;
        } catch (error: any) {
            officialProfile = null;
            isLoading = false;
            console.error("Error roasting official:", error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 504) {
                    roastingResult = "Response timeout, please try again";
                } else if (error.response?.status === 429) {
                    roastingResult = "Too many request, please try again later";
                } else {
                    roastingResult =
                        error.response?.data.message ??
                        error.response?.data.error;
                }
            } else {
                roastingResult = error.message;
            }
        }
        isLoading = false;
    }

    $: selectedOfficial =
        officialOptions.find((u) => u.value === selectedOfficialValue) || null;

    $: filteredOfficials = officialOptions.filter(
        (item) =>
            item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    function toggleCustomSelect() {
        if (officialOptions.length === 0) {
            getPejabat();
        }

        isCustomSelectOpen = !isCustomSelectOpen;
        if (isCustomSelectOpen) {
            searchTerm = "";
        }
    }

    function closeCustomSelect() {
        isCustomSelectOpen = false;
    }

    function handleSelectUser(user) {
        // console.log(user);
        selectedOfficialValue = user.value;
        selectedOfficial = null;
        roastingResult = "";
        closeCustomSelect();
    }

   
    function clickOutside(node, handler) {
        const handleClick = (event) => {
            if (
                node &&
                !node.contains(event.target) &&
                !event.defaultPrevented
            ) {
                handler();
            }
        };

        document.addEventListener("click", handleClick, true);

        return {
            destroy() {
                document.removeEventListener("click", handleClick, true);
            },
        };
    }
</script>

<svelte:head>
    <title>Roasting Pejabat Indo 🚗🚗🚗</title>
</svelte:head>
<main class="min-h-lvh flex flex-col justify-center">
    <div class="container mx-auto p-4 max-w-2xl">
        <h1 class="text-3xl font-bold text-center mb-6">
            Roasting Pejabat Indo 🚗🚗🚗
        </h1>

        <div class="shadow-md p-6 mb-6 space-y-6">
            <div class="lg:col-span-1">
                <label
                    for="pejabat"
                    class="block text-sm font-medium text-neutral-400 mb-1"
                    >Select Official</label
                >

                <div class="relative" use:clickOutside={closeCustomSelect}>
                    <button
                        type="button"
                        id="pejabat"
                        on:click|stopPropagation={toggleCustomSelect}
                        class="relative w-full bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 text-sm text-left flex items-center justify-between
                                   focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {#if selectedOfficial}
                            <span class="flex items-center gap-3">
                                <img
                                    src={selectedOfficial.imageUrl}
                                    alt={selectedOfficial.text.substring(0, 2)}
                                    class="w-6 h-6 shrink-0"
                                />
                                <span class="text-neutral-200 text-sm"
                                    >{selectedOfficial.text}</span
                                >
                            </span>
                        {:else}
                            <span class="flex items-center gap-3">
                                <span class="text-neutral-500"
                                    >Pilih pejabat...</span
                                >
                            </span>
                        {/if}

                        <!-- Icon Chevron -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-4 h-4 text-neutral-400 transition-transform"
                            class:rotate-180={isCustomSelectOpen}
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    </button>

                    {#if isCustomSelectOpen}
                        <div
                            id="custom-select-panel"
                            class="absolute z-10 w-full mt-1 bg-neutral-900 border border-neutral-700 shadow-lg"
                        >
                            <div class="p-2 border-b border-neutral-800">
                                <input
                                    type="text"
                                    id="custom-select-search"
                                    class="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 text-sm placeholder-neutral-500
                                          focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="Cari pejabat..."
                                    autocomplete="off"
                                    bind:value={searchTerm}
                                    on:click|stopPropagation
                                />
                            </div>

                            <ul
                                id="custom-select-options"
                                class="max-h-56 overflow-y-auto"
                            >
                                {#if loadingGetPejabat}
                                    <li
                                        class="px-3 py-2 text-sm text-neutral-400"
                                    >
                                        Loading officials...
                                    </li>
                                {:else}
                                    {#each filteredOfficials as user (user.value)}
                                        <li
                                            class="flex items-center p-3 hover:bg-neutral-800 cursor-pointer text-sm"
                                            on:click={() =>
                                                handleSelectUser(user)}
                                            class:bg-neutral-800={selectedOfficialValue ===
                                                user.value}
                                        >
                                            <img
                                                src={user.imageUrl}
                                                alt={user.text.substring(0, 2)}
                                                class="w-8 h-8 mr-3 shrink-0"
                                            />
                                            <div
                                                class="flex flex-col overflow-hidden"
                                            >
                                                <span
                                                    class="text-neutral-200 truncate"
                                                    >{user.text}</span
                                                >
                                                <span
                                                    class="text-xs text-neutral-400 truncate"
                                                    >{user.jabatan}</span
                                                >
                                            </div>
                                        </li>
                                    {:else}
                                        <li
                                            class="p-3 text-sm text-neutral-500"
                                        >
                                            Tidak ada hasil.
                                        </li>
                                    {/each}
                                {/if}
                            </ul>
                        </div>
                    {/if}
                </div>
            </div>
            <div>
                <label
                    for="language"
                    class="block text-sm font-medium text-neutral-400 mb-1"
                    >Language</label
                >
                <div class="relative">
                    <select
                        id="language"
                        name="language"
                        class="w-full appearance-none bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        bind:value={language}
                    >
                        {#each [{ value: "english", text: "English" }, { value: "indonesian", text: "Indonesian" }] as option (option.value)}
                            <option value={option.value}>{option.text}</option>
                        {/each}
                    </select>
                    <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-4 h-4"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <button
                disabled={isLoading}
                on:click={roastOfficial}
                class="w-full bg-red-900 text-red-300 border border-red-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            >
                {isLoading ? "Roasting..." : "Roast 🚗🚗🚗"}
            </button>
        </div>

        {#if roastingResult != ""}
            <div class=" shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-4">Roasting Result</h2>
                <div
                    class="flex flex-col md:flex-row items-center justify-center space-x-4"
                >
                    {#if selectedOfficial != null}
                        <img
                            style="max-height: 200px;"
                            src={selectedOfficial.imageUrl}
                            alt="{selectedOfficial.text} Picture"
                        />
                    {/if}
                    <p class="text-sm">
                        <SvelteMarkdown source={roastingResult} />
                    </p>
                </div>
            </div>
        {/if}
    </div>
    <div style="height: 100px;"></div>
    <div
        id="footer"
        class="fixed left-0 right-0 p-2 flex flex-col gap-2 text-center justify-center w-full bg-gray-800 bottom-0"
    >
        <div class="flex gap-2 justify-center">
            <a
                href="https://wallofdonations.my.id"
                class="underline"
                target="_blank"
            >
                WallOfDonations
            </a>
            <a
                href="https://roastgithub.my.id"
                class="underline"
                target="_blank">RoastGithub</a
            >
            <a
                href="https://roastlinkedin.my.id"
                class="underline"
                target="_blank">RoastLinkedin</a
            >
            <a
                href="https://roastwaifu.my.id"
                class="underline"
                target="_blank">RoastWaifu</a
            >
        </div>
        <div class="flex justify-center gap-2 items-center">
            <a href="https://trakteer.id/bagood" target="_blank"
                ><img
                    id="wse-buttons-preview"
                    src="https://cdn.trakteer.id/images/embed/trbtn-red-1.png?date=18-11-2023"
                    height="40"
                    style="border: 0px; height: 40px; --darkreader-inline-border-top: 0px; --darkreader-inline-border-right: 0px; --darkreader-inline-border-bottom: 0px; --darkreader-inline-border-left: 0px;"
                    alt="Trakteer Saya"
                    data-darkreader-inline-border-top=""
                    data-darkreader-inline-border-right=""
                    data-darkreader-inline-border-bottom=""
                    data-darkreader-inline-border-left=""
                /></a
            >
            <iframe
                src="https://ghbtns.com/github-btn.html?user=bagusindrayana&repo=roastpejabat&type=star&count=true&size=large"
                frameborder="0"
                scrolling="0"
                width="170"
                height="30"
                title="GitHub"
            ></iframe>
        </div>
    </div>
</main>
