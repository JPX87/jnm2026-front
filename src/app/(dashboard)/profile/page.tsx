export default async function ProfilePage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-0">
            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Programme de l&apos;événement</h2>
                <p className="text-white/70 text-sm sm:text-base">Découvrez toutes les informations importantes</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                {/* Image principale */}
                <div className="dashboard-card-shadow rounded-2xl sm:rounded-3xl overflow-hidden w-full lg:w-80 h-64 sm:h-96 border-4 border-white/30 flex-shrink-0 group">
                    <img
                        src="/assets/images/grave.png"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt="Événement"
                    />
                </div>

                {/* Cartes d'action */}
                <div className="flex flex-col gap-4 sm:gap-6 flex-1">
                    {/* Carte Programme */}
                    <button className="dashboard-card-shadow dashboard-glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-left group hover:bg-white transition-all duration-300">
                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-2xl font-bold text-[#ef6a9f] mb-0.5 sm:mb-1 truncate">
                                    Voir le programme
                                </h3>
                                <p className="text-[#ef6a9f]/60 text-xs sm:text-sm">
                                    Consultez le planning complet
                                </p>
                            </div>
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ff89b8]/10 flex items-center justify-center group-hover:bg-[#ff89b8] group-hover:text-white transition-all duration-300">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#ef6a9f] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Carte Hôtel */}
                    <button className="dashboard-card-shadow dashboard-glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-left group hover:bg-white transition-all duration-300">
                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <img
                                    src="/assets/images/hotel.png"
                                    className="w-full h-full object-cover"
                                    alt="Hôtel"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-xl font-bold text-[#ef6a9f] mb-0.5 sm:mb-1">
                                    Votre hébergement
                                </h3>
                                <p className="text-[#ef6a9f]/80 font-medium text-sm sm:text-base mb-1 sm:mb-2">
                                    Hotel Formule 1
                                </p>
                                <div className="flex items-center gap-2 text-[#ef6a9f]/60 text-xs sm:text-sm">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="truncate">Ramonville-Saint-Agne 31526</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ff89b8]/10 flex items-center justify-center group-hover:bg-[#ff89b8] group-hover:text-white transition-all duration-300">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#ef6a9f] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Info supplémentaire */}
                    <div className="dashboard-glass rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#ff89b8]/30">
                        <div className="flex items-center gap-2 sm:gap-3 text-[#ef6a9f]">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs sm:text-sm">Cliquez sur une carte pour plus de détails</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
