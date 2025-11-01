<script>
    // --- State untuk Komponen ---

    // [Input & Select]
    let apiEndpoint = "";
    let threshold = 85;
    let serverCluster = "cluster-a";
    const clusterOptions = [
        { value: "cluster-a", text: "Cluster A (Primary)" },
        { value: "cluster-b", text: "Cluster B (Secondary)" },
        { value: "cluster-c", text: "Cluster C (Failover)" },
    ];

    // [Checkbox & Switch]
    let cbDiagnostics = false;
    let cbLogs = true;
    let maintenanceMode = false; // Ini menggantikan script JS untuk switch

    // [List]
    const trafficItems = [
        { id: "001", text: "NORTH AMERICA" },
        { id: "002", text: "EUROPE" },
        { id: "003", text: "ASIA PACIFIC" },
        { id: "004", text: "OTHER REGIONS" },
    ];

    // [Badge]
    const iconPaths = {
        danger: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
        warning:
            "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
        info: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z",
        success:
            "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    };

    const alerts = [
        {
            variant: "danger",
            text: "High memory usage detected on server cluster A",
            icon: iconPaths.danger,
            colors: "bg-red-900/50 border-red-700 text-red-300 icon-red-400",
        },
        {
            variant: "warning",
            text: "API rate limit approaching threshold (85%)",
            icon: iconPaths.warning,
            colors: "bg-yellow-900/50 border-yellow-700 text-yellow-300 icon-yellow-400",
        },
        {
            variant: "info",
            text: "Scheduled maintenance window in 2 hours",
            icon: iconPaths.info,
            colors: "bg-blue-900/50 border-blue-700 text-blue-300 icon-blue-400",
        },
        {
            variant: "success",
            text: "All systems operational",
            icon: iconPaths.success,
            colors: "bg-green-900/50 border-green-700 text-green-300 icon-green-400",
        },
    ];

    // [Custom Select with Search & Image]

    // Data untuk dropdown
    const userOptions = [
        {
            value: "ada.lovelace",
            text: "Ada Lovelace",
            email: "ada.lovelace@babbage.com",
            imageUrl: "https://placehold.co/40x40/f87171/ffffff?text=AL",
        },
        {
            value: "alan.turing",
            text: "Alan Turing",
            email: "alan.turing@enigma.org",
            imageUrl: "https://placehold.co/40x40/60a5fa/ffffff?text=AT",
        },
        {
            value: "grace.hopper",
            text: "Grace Hopper",
            email: "grace.hopper@navy.mil",
            imageUrl: "https://placehold.co/40x40/4ade80/ffffff?text=GH",
        },
        {
            value: "margaret.hamilton",
            text: "Margaret Hamilton",
            email: "margaret.h@apollo.nasa",
            imageUrl: "https://placehold.co/40x40/facc15/000000?text=MH",
        },
        {
            value: "don.knuth",
            text: "Donald Knuth",
            email: "don.knuth@stanford.edu",
            imageUrl: "https://placehold.co/40x40/c084fc/ffffff?text=DK",
        },
        {
            value: "tim.berners-lee",
            text: "Tim Berners-Lee",
            email: "tim.bl@w3c.org",
            imageUrl: "https://placehold.co/40x40/a78bfa/ffffff?text=TL",
        },
    ];

    let isCustomSelectOpen = false;
    let selectedUserValue = null; // Ini akan menampung value, misal: 'ada.lovelace'
    let searchTerm = "";

    // State turunan (Derived state)
    $: selectedUser =
        userOptions.find((u) => u.value === selectedUserValue) || null;

    $: filteredUsers = userOptions.filter(
        (item) =>
            item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    function toggleCustomSelect() {
        isCustomSelectOpen = !isCustomSelectOpen;
        if (isCustomSelectOpen) {
            searchTerm = ""; // Reset pencarian saat dibuka
        }
    }

    function closeCustomSelect() {
        isCustomSelectOpen = false;
    }

    function handleSelectUser(user) {
        selectedUserValue = user.value;
        closeCustomSelect();
    }

    /**
     * Aksi 'use:clickOutside'
     * Ini akan memanggil fungsi 'closeCustomSelect' saat
     * pengguna mengklik di luar elemen 'wrapper' custom select.
     */
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

<main class="p-8 md:p-12">
    <h1
        class="text-3xl font-semibold text-white mb-8 border-b border-neutral-700 pb-4"
    >
        Koleksi Komponen UI (Svelte)
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Card -->
        <div class="lg:col-span-2">
            <h2
                class="text-xl font-semibold text-neutral-200 mb-4 font-tech-mono"
            >
                [ Card ]
            </h2>
            <div class="bg-neutral-900 border border-neutral-800 p-6">
                <h3
                    class="text-lg font-semibold text-white mb-3 border-b border-neutral-700 pb-3"
                >
                    Performance Overview
                </h3>
                <p class="text-sm text-neutral-400">
                    Ini adalah contoh komponen Card. Semua elemen ditempatkan di
                    dalam kontainer ini. Gayanya menggunakan latar belakang
                    `bg-neutral-900` dan batas `border-neutral-800` tanpa sudut
                    bulat.
                </p>
                <div class="mt-4 flex gap-2">
                    <span
                        class="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-green-900 text-green-300 border border-green-700"
                    >
                        <svg
                            class="w-2 h-2 mr-1.5 fill-current"
                            viewBox="0 0 8 8"
                            ><circle cx="4" cy="4" r="4" /></svg
                        >
                        LIVE
                    </span>
                    <span
                        class="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700"
                        >By Endpoint</span
                    >
                </div>
            </div>
        </div>

        <!-- Tombol (Buttons) -->
        <div>
            <h2
                class="text-xl font-semibold text-neutral-200 mb-4 font-tech-mono"
            >
                [ Button ]
            </h2>
            <div class="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
                <!-- Tombol-tombol ini bisa dijadikan komponen <Button> tersendiri -->
                <button
                    class="w-full bg-neutral-700 text-neutral-200 px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-neutral-600 active:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                >
                    Run Diagnostics
                </button>
                <button
                    class="w-full bg-neutral-800 text-neutral-400 px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-neutral-700 active:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                >
                    Clear Cache (Idle)
                </button>
                <button
                    class="w-full bg-red-900 text-red-300 border border-red-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                >
                    Hentikan Server
                </button>
                <button
                    class="w-full bg-blue-900 text-blue-300 border border-blue-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                >
                    Info
                </button>
            </div>
        </div>

        <!-- Input & Select -->
        <div>
            <h2
                class="text-xl font-semibold text-neutral-200 mb-4 font-tech-mono"
            >
                [ Input & Select ]
            </h2>
            <div class="bg-neutral-900 border border-neutral-800 p-6 space-y-6">
                <!-- Input Teks (Dihubungkan dengan bind:value) -->
                <div>
                    <label
                        for="api_endpoint"
                        class="block text-sm font-medium text-neutral-400 mb-1"
                        >API Endpoint</label
                    >
                    <input
                        type="text"
                        id="api_endpoint"
                        name="api_endpoint"
                        class="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="/api/users"
                        bind:value={apiEndpoint}
                    />
                </div>

                <!-- Input Angka (Dihubungkan dengan bind:value) -->
                <div>
                    <label
                        for="threshold"
                        class="block text-sm font-medium text-neutral-400 mb-1"
                        >Threshold (%)</label
                    >
                    <input
                        type="number"
                        id="threshold"
                        name="threshold"
                        class="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="85"
                        bind:value={threshold}
                    />
                </div>

                <!-- Select Dropdown (Dihubungkan dengan bind:value dan {#each}) -->
                <div>
                    <label
                        for="server_cluster"
                        class="block text-sm font-medium text-neutral-400 mb-1"
                        >Server Cluster</label
                    >
                    <div class="relative">
                        <select
                            id="server_cluster"
                            name="server_cluster"
                            class="w-full appearance-none bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            bind:value={serverCluster}
                        >
                            {#each clusterOptions as option (option.value)}
                                <option value={option.value}
                                    >{option.text}</option
                                >
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
            </div>
        </div>

        <!-- Checkbox & Switch -->
        <div>
            <h2
                class="text-xl font-semibold text-neutral-200 mb-4 font-tech-mono"
            >
                [ Checkbox & Switch ]
            </h2>
            <div class="bg-neutral-900 border border-neutral-800 p-6 space-y-5">
                <!-- Checkbox (Dihubungkan dengan bind:checked) -->
                <div class="relative flex items-center">
                    <input
                        id="cb-diagnostics"
                        name="cb-diagnostics"
                        type="checkbox"
                        class="peer relative h-4 w-4 shrink-0 appearance-none border border-neutral-600 bg-neutral-800 transition-all
                                  checked:bg-green-600 checked:border-0
                                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                        bind:checked={cbDiagnostics}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="3"
                        stroke="currentColor"
                        class="absolute left-0 top-0 h-4 w-4 hidden peer-checked:block text-white pointer-events-none"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                        />
                    </svg>
                    <label
                        for="cb-diagnostics"
                        class="ml-2 text-sm text-neutral-300"
                        >Run diagnostics on startup</label
                    >
                </div>

                <!-- Checkbox (Dihubungkan dengan bind:checked) -->
                <div class="relative flex items-center">
                    <input
                        id="cb-logs"
                        name="cb-logs"
                        type="checkbox"
                        class="peer relative h-4 w-4 shrink-0 appearance-none border border-neutral-600 bg-neutral-800 transition-all
                                  checked:bg-green-600 checked:border-0
                                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                        bind:checked={cbLogs}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="3"
                        stroke="currentColor"
                        class="absolute left-0 top-0 h-4 w-4 hidden peer-checked:block text-white pointer-events-none"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                        />
                    </svg>
                    <label for="cb-logs" class="ml-2 text-sm text-neutral-300"
                        >Enable verbose logging</label
                    >
                </div>

                <div class="border-t border-neutral-800 my-4"></div>

                <!-- Switch (Toggle) - Digerakkan oleh Svelte -->
                <div class="flex items-center justify-between">
                    <label
                        for="maintenance-mode"
                        class="text-sm text-neutral-300">Maintenance Mode</label
                    >
                    <button
                        type="button"
                        role="switch"
                        aria-checked={maintenanceMode}
                        on:click={() => (maintenanceMode = !maintenanceMode)}
                        class="peer relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out
                                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                        id="maintenance-mode"
                    >
                        <!-- Track (menggunakan class: directive Svelte) -->
                        <span
                            class="absolute h-full w-full border transition-colors"
                            class:bg-neutral-700={!maintenanceMode}
                            class:border-neutral-600={!maintenanceMode}
                            class:bg-green-900={maintenanceMode}
                            class:border-green-700={maintenanceMode}
                        ></span>
                        <!-- Knob (menggunakan class: directive Svelte) -->
                        <span
                            aria-hidden="true"
                            class="pointer-events-none absolute left-0 top-0 inline-block h-5 w-5 transform shadow ring-0 transition duration-200 ease-in-out"
                            class:translate-x-0={!maintenanceMode}
                            class:bg-neutral-300={!maintenanceMode}
                            class:translate-x-5={maintenanceMode}
                            class:bg-white={maintenanceMode}
                        >
                        </span>
                    </button>
                    <!-- Tidak perlu script JS manual lagi -->
                </div>
            </div>
        </div>

        <!-- List (Menggunakan {#each}) -->
        <div>
            <h2
                class="text-xl font-semibold text-neutral-200 mb-4 font-tech-mono"
            >
                [ List ]
            </h2>
            <div class="bg-neutral-900 border border-neutral-800 p-6">
                <h3
                    class="text-base font-semibold text-white mb-4 border-b border-neutral-700 pb-2"
                >
                    Traffic Distribution
                </h3>
                <ul class="space-y-3">
                    {#each trafficItems as item (item.id)}
                        <li class="flex items-center">
                            <span class="block h-3 w-1 bg-neutral-600 mr-3"
                            ></span>
                            <span
                                class="text-sm font-tech-mono text-neutral-400 mr-2"
                                >{item.id}</span
                            >
                            <span class="text-sm text-neutral-200"
                                >{item.text}</span
                            >
                        </li>
                    {/each}
                </ul>
            </div>
        </div>

        <!-- Badge (Menggunakan {#each}) -->
        <div>
            <h2
                class="text-xl font-semibold text-neutral-200 mb-4 font-tech-mono"
            >
                [ Badge ]
            </h2>
            <div class="bg-neutral-900 border border-neutral-800 p-6">
                <h3
                    class="text-base font-semibold text-white mb-4 border-b border-neutral-700 pb-2"
                >
                    Status Alerts
                </h3>
                <div class="space-y-4">
                    {#each alerts as alert (alert.variant)}
                        <!-- Menerapkan class dinamis dari objek 'alert' -->
                        <div
                            class="flex items-start gap-3 p-3 {alert.colors.replace(
                                'icon-',
                                'text-',
                            )}"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-5 h-5 shrink-0"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d={alert.icon}
                                />
                            </svg>
                            <p class="text-sm">{alert.text}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Custom Select with Search & Image (Svelte-powered) -->
        <div class="lg:col-span-1">
            <h2
                class="text-xl font-semibold text-neutral-200 mb-4 font-tech-mono"
            >
                [ Custom Select ]
            </h2>
            <div class="bg-neutral-900 border border-neutral-800 p-6">
                <label
                    for="custom-select-button"
                    class="block text-sm font-medium text-neutral-400 mb-1"
                    >Assign User</label
                >

                <!-- Wrapper untuk komponen custom select, dengan aksi 'use:clickOutside' -->
                <div class="relative" use:clickOutside={closeCustomSelect}>
                    <!-- Tombol Tampilan Nilai Terpilih -->
                    <button
                        type="button"
                        id="custom-select-button"
                        on:click|stopPropagation={toggleCustomSelect}
                        class="relative w-full bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 text-sm text-left flex items-center justify-between
                                   focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <!-- Tampilan dinamis berdasarkan 'selectedUser' -->
                        {#if selectedUser}
                            <span class="flex items-center gap-3">
                                <img
                                    src={selectedUser.imageUrl}
                                    alt={selectedUser.text.substring(0, 2)}
                                    class="w-6 h-6 shrink-0"
                                />
                                <span class="text-neutral-200 text-sm"
                                    >{selectedUser.text}</span
                                >
                            </span>
                        {:else}
                            <span class="flex items-center gap-3">
                                <span class="text-neutral-500"
                                    >Pilih pengguna...</span
                                >
                            </span>
                        {/if}

                        <!-- Ikon Chevron (berputar berdasarkan state 'isCustomSelectOpen') -->
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

                    <!-- Panel Dropdown (ditampilkan dengan {#if isCustomSelectOpen}) -->
                    {#if isCustomSelectOpen}
                        <div
                            id="custom-select-panel"
                            class="absolute z-10 w-full mt-1 bg-neutral-900 border border-neutral-700 shadow-lg"
                        >
                            <!-- Input Pencarian (dihubungkan dengan bind:value) -->
                            <div class="p-2 border-b border-neutral-800">
                                <input
                                    type="text"
                                    id="custom-select-search"
                                    class="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 text-sm placeholder-neutral-500
                                          focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="Cari pengguna..."
                                    bind:value={searchTerm}
                                    on:click|stopPropagation
                                />
                                <!-- Hentikan propagasi agar dropdown tidak tertutup -->
                            </div>

                            <!-- Daftar Opsi (di-render dengan {#each filteredUsers}) -->
                            <ul
                                id="custom-select-options"
                                class="max-h-56 overflow-y-auto"
                            >
                                {#each filteredUsers as user (user.value)}
                                    <li
                                        class="flex items-center p-3 hover:bg-neutral-800 cursor-pointer text-sm"
                                        on:click={() => handleSelectUser(user)}
                                        class:bg-neutral-800={selectedUserValue ===
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
                                                >{user.email}</span
                                            >
                                        </div>
                                    </li>
                                {:else}
                                    <li class="p-3 text-sm text-neutral-500">
                                        Tidak ada hasil.
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</main>
