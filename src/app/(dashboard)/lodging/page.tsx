'use client';

import { useCallback } from 'react';

const HOTEL_LAT = 43.5600;
const HOTEL_LNG = 1.4750;
const HOTEL_QUERY = 'Hotel+Formule+1+Ramonville-Saint-Agne';

export default function LogementPage() {
    const openMap = useCallback(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
            window.open(`maps://maps.apple.com/?q=${HOTEL_QUERY}&ll=${HOTEL_LAT},${HOTEL_LNG}`, '_blank');
        } else {
            window.open(`https://www.google.com/maps/search/?api=1&query=${HOTEL_LAT},${HOTEL_LNG}&query_place_id=${HOTEL_QUERY}`, '_blank');
        }
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-0">
            {/* Titre */}
            <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg">
                    Vous allez bien dormir !
                </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                {/* Carte gauche */}
                <div className="dashboard-card-shadow dashboard-glass rounded-2xl sm:rounded-3xl w-full lg:w-1/2 border border-white/30 p-4 sm:p-6 flex flex-col dashboard-fade-in">
                    {/* Photo hôtel */}
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-5 sm:mb-6 group">
                        <img
                            src="/assets/images/hotel.png"
                            className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                            alt="Hotel Formule 1"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#ef6a9f]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
                            <span className="text-[#ef6a9f] text-xs sm:text-sm font-bold">Hotel F1</span>
                        </div>
                    </div>

                    {/* Étage & Chambre */}
                    <div className="flex gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div className="flex-1 bg-gradient-to-br from-[#ff89b8]/10 to-[#ef6a9f]/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center border border-[#ff89b8]/20">
                            <div className="flex items-center justify-center gap-1.5 mb-1.5 sm:mb-2">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ef6a9f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <p className="text-[#ef6a9f]/70 font-semibold text-xs sm:text-sm uppercase tracking-wide">Etage</p>
                            </div>
                            <p className="text-[#ef6a9f] text-4xl sm:text-5xl font-extrabold">1</p>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-[#ff89b8]/10 to-[#ef6a9f]/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center border border-[#ff89b8]/20">
                            <div className="flex items-center justify-center gap-1.5 mb-1.5 sm:mb-2">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ef6a9f]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <p className="text-[#ef6a9f]/70 font-semibold text-xs sm:text-sm uppercase tracking-wide">Chambre</p>
                            </div>
                            <p className="text-[#ef6a9f] text-4xl sm:text-5xl font-extrabold">12</p>
                        </div>
                    </div>

                    {/* Bouton colocataires */}
                    <button className="group w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#ff89b8]/10 to-[#ef6a9f]/10 hover:from-[#ff89b8] hover:to-[#ef6a9f] border border-[#ff89b8]/30 rounded-xl sm:rounded-2xl py-3 sm:py-3.5 text-[#ef6a9f] hover:text-white font-semibold text-sm sm:text-base transition-all duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Voir avec qui je partage ma chambre
                        <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Colonne droite */}
                <div className="flex flex-col gap-6 sm:gap-8 flex-1">
                    {/* Carte Map */}
                    <div className="dashboard-card-shadow dashboard-glass rounded-2xl sm:rounded-3xl border border-white/30 p-4 sm:p-6 dashboard-fade-in">
                        <div
                            className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-4 cursor-pointer group"
                            onClick={openMap}
                        >
                            <iframe
                                src={`https://maps.google.com/maps?q=${HOTEL_LAT},${HOTEL_LNG}&z=15&output=embed`}
                                className="w-full h-36 sm:h-48 border-0 pointer-events-none"
                                loading="lazy"
                                allowFullScreen
                                title="Carte Hotel Formule 1"
                            ></iframe>
                            <div className="absolute inset-0 bg-[#ef6a9f]/0 group-hover:bg-[#ef6a9f]/20 transition-colors duration-300 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                                    <svg className="w-5 h-5 text-[#ef6a9f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="text-center space-y-1">
                            <h3 className="text-[#ef6a9f] font-bold text-base sm:text-lg">Hotel Formule 1</h3>
                            <div className="flex items-center justify-center gap-1.5 text-[#ef6a9f]/60">
                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm sm:text-base">Ramonville-Saint-Agne, 31526</p>
                            </div>
                            <button
                                onClick={openMap}
                                className="inline-flex items-center gap-1.5 text-[#ff89b8] font-semibold text-sm sm:text-base hover:text-[#ef6a9f] transition-colors duration-300 mt-1"
                            >
                                Ouvrir sur map
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Carte Transports */}
                    <div className="dashboard-card-shadow dashboard-glass rounded-2xl sm:rounded-3xl border border-white/30 p-4 sm:p-6 dashboard-fade-in">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#ef6a9f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <h3 className="text-[#ef6a9f] font-bold text-sm sm:text-base">Transports à proximité</h3>
                        </div>

                        <div className="flex items-center justify-around gap-2 sm:gap-4">
                            <div className="group flex flex-col items-center gap-1.5 sm:gap-2">
                                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                    <span className="text-white text-lg sm:text-2xl font-bold">B</span>
                                </div>
                                <span className="text-[#ef6a9f]/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Arret</span>
                            </div>
                            <div className="group flex flex-col items-center gap-1.5 sm:gap-2">
                                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-[#6B8E23] flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                    <span className="text-white text-base sm:text-xl font-bold">27</span>
                                </div>
                                <span className="text-[#ef6a9f]/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Arret</span>
                            </div>
                            <div className="group flex flex-col items-center gap-1.5 sm:gap-2">
                                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-[#D2691E] flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                    <span className="text-white text-sm sm:text-lg font-bold">L12</span>
                                </div>
                                <span className="text-[#ef6a9f]/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Arret</span>
                            </div>
                            <div className="group flex flex-col items-center gap-1.5 sm:gap-2">
                                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-[#808080] flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                    <span className="text-white text-base sm:text-xl font-bold">37</span>
                                </div>
                                <span className="text-[#ef6a9f]/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Arret</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
