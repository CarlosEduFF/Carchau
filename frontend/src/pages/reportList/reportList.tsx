import './control.css';


const ReportList: React.FC = () => {


    return (
        <>
            <div className="bg-background-light dark:bg-background-dark font-display">
                <div className="flex h-screen w-full antialiased text-gray-800 dark:text-gray-200">
                    <div className="flex flex-row h-full w-full overflow-x-hidden">
                        {/*<!-- Left Column: Sidebar -->*/}
                        <div
                            className="flex flex-col py-4 px-3 w-80 bg-white dark:bg-[#19222c] flex-shrink-0 border-r border-gray-200 dark:border-gray-800">
                            {/*<!-- User Profile & Title -->*/}
                            <div className="flex flex-row items-center justify-between h-12 w-full px-2">
                                <div className="flex items-center gap-3">
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                        data-alt="User avatar"
                                        style={{ backgroundImage: ' url("https://lh3.googleusercontent.com/aida-public/AB6AXuD17oVRvdTomG3p-Co0vV93ktpVYlvrtCnI40nXW7-g1ov2UymqrsYfO_a5ItddGv9xT03aSfjPHgTRb5vrT-LxgPUAlOw08PruObS6gbuWfseSH7a2O7hmDipIAVDecWHj1UvQ3iRw8EVDbv-kSX9XvSuUjV7BJjxQjOiwf1xV1zJVWupnUcg-xY7mrKcBGlztN7eBn84XZCnIuPimg_SYeQOyiV4CdsYsq9jUP1j0jluR6RTV_RBsrr5WZgcjYIA8M614xVOwDfQ")'}}>
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">Alex Mercer
                                        </h1>
                                        <p className="text-green-500 text-sm font-normal leading-normal">Online</p>
                                    </div>
                                </div>
                            </div>
                            {/*<!-- Search Bar -->*/}
                            <div className="px-2 py-4">
                                <label className="flex flex-col min-w-40 h-11 w-full">
                                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                        <div
                                            className="text-gray-500 dark:text-gray-400 flex bg-gray-100 dark:bg-background-dark items-center justify-center pl-3 rounded-l-lg border-r-0">
                                            <span className="material-symbols-outlined text-xl">search</span>
                                        </div>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-100 dark:bg-background-dark focus:border-none h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal"
                                            placeholder="Search contacts or messages..." value="" />
                                    </div>
                                </label>
                            </div>
                            {/*<!-- Conversation List -->*/}
                            <div className="flex flex-col -mx-3">
                                {/*<!-- Active List Item -->*/}
                                <div
                                    className="flex gap-4 bg-primary/10 dark:bg-primary/20 px-4 py-3 justify-between cursor-pointer border-l-4 border-primary">
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                                                data-alt="Avatar of Elara Vance"
                                                style={{ backgroundImage: ' url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZEolb_x8HcT4g2r1jCoV-rdS24Vi6f_yTR0dh6FT2CobQXGWIobrywWA4Iqo_uf5c4WBWGQD73tCWks1zJNMBIOtpBW2dehtizrXLbhNPpReFlySuodCcIgodTRkWqBkJt99AY1uVoEGfeLiJ-rQnRv6EjHI0ZQ6WivKjAPqpDGSGx6FvRq91dShi5fBp4clKbkGIgsETJxahFXv_5usul6nvHSyCl99phW_OnC_fpTZJxltOAl96zEIscznRlu2oIEhmduuOdY4")'}}>
                                            </div>
                                            <span
                                                className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-[#19222c]"></span>
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center">
                                            <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">Elara
                                                Vance</p>
                                            <p className="text-primary dark:text-primary-light text-sm font-medium leading-normal">
                                                Sounds great! See you then.</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                                        <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">5m ago</p>
                                        <span
                                            className="flex items-center justify-center text-xs text-white bg-primary rounded-full h-5 w-5">2</span>
                                    </div>
                                </div>
                                {/*<!-- List Item 2 -->*/}
                                <div
                                    className="flex items-center gap-4 px-4 py-3 justify-between hover:bg-gray-100 dark:hover:bg-background-dark cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                                                data-alt="Avatar of Ronan Steele"
                                                style={{ backgroundImage: ' url("https://lh3.googleusercontent.com/aida-public/AB6AXuClwR29O7vEifojlGM3A2ChnxqQNfuUfj_JAWY1ZMzT_AJ1H7w946ghJv2Xkfexo3dq4YkBW0_uiKSWn2SRz77SG6lpErvMaVCGHb_9v-rxbicTXnDVo74TBHcF92fm9UXZGqtjOvm4uV6j8eYQcuKtTsfcAVqjVVqgwkuAI4_s5BxkZL-Zu5S8yrK-wv1bFmQBnbJdEFLkT8CmynxTinXaivAevGdt0YxqbVWekoRrjuus8zhU4ie-JTq8jBAuEvoCoU1XPkB-yVQ")'}}>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p
                                                className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                                                Ronan Steele</p>
                                            <p
                                                className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-1">
                                                Can you send over the file?</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">Yesterday</p>
                                    </div>
                                </div>
                                {/*<!-- List Item 3 -->*/}
                                <div
                                    className="flex items-center gap-4 px-4 py-3 justify-between hover:bg-gray-100 dark:hover:bg-background-dark cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                                                data-alt="Avatar of Seraphina Moon"
                                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoFcvxyL597IOHKsxeTxIzrvvPS75y35KkYiGhs2TMKGyGLuCi-onKQCmKtpmVN4vkft8t_1FVtwbQNEzXbnl_jLA1LutilX0f4pmO_-BPh23x28GEyNWZnsWXB6uhfXkasrCHVxZ24yOdTvO2ArXKLj9GSWStT2i3OsIa9z_IppfAsbPigincO9h8P3BPlsvWGodGI49RRU50WWrNcEOQUO17SSpM6D86LHZTrqk31CScEonJqeV1mUspQIJBbxZpq15uuM73LgY")'}}>
                                            </div>
                                            <span
                                                className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-[#19222c]"></span>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p
                                                className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                                                Seraphina Moon</p>
                                            <p
                                                className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-1">
                                                Loved the photos from the trip!</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">10/28/23</p>
                                    </div>
                                </div>
                                {/*<!-- List Item 4 -->*/}
                                <div
                                    className="flex items-center gap-4 px-4 py-3 justify-between hover:bg-gray-100 dark:hover:bg-background-dark cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                                                data-alt="Avatar of Orion Blackwood"
                                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCagEAmxmNcN6AE6gYemRFovCoM0mDtm06xEn93tccd8tjZ_qJVBmgDx2XvgflXJ21okl_lRk_XSe4yBpISBCGIwMScU0H_E-7fyD7erxL3bdBRPL8PqKWJXbmgrliU0UmHuw7_oMiaS-SJ0bJgjxp4jEh8meaEfDYuzHa13kPbyCkgOE5ym9gCGribNumPJK5_lBHKCjIf0JTYQfdd6YugOTvSF3BW-NjZ98MQqG7-YwstCl7gBNzFYecwKodfbuxLzDjHWrm_8qw");'}}>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p
                                                className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">
                                                Orion Blackwood</p>
                                            <p
                                                className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-1">
                                                Yeah, I'm free tomorrow afternoon.</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">10/27/23</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<!-- Right Column: Main Chat Area -->*/}
                        <div className="flex flex-col flex-auto h-full p-0">
                            <div className="flex flex-col flex-auto flex-shrink-0 h-full bg-background-light dark:bg-background-dark">
                                {/*<!-- Chat Header -->*/}
                                <div
                                    className="flex items-center justify-between h-16 w-full px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#19222c]">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                                data-alt="Avatar of Elara Vance"
                                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBi9PQ2UGzlU_-doCKoZpTSCrjQeiBuL8Y73XotvQOb4iJH4ymdROHF3CNXugqlZVFAj5huhkhpb3kghf6vmh0Jsnykrh46W5349qIXAkF2OAIgXkZ2aylRp4rpIp-9hf8iubkFzy7DYFMTCdQWcXYYBTnfPLVMsWYkHqqj6BI1cgjWVWqcN6aw8WNOqvSxZvprC-gg6eeiHEif2-OP8q8xpuArH9jgiNp64u4bpwV5ftpotLIy6I12A3Xc_FvF5_11PNdaq8GGc-Y");'}}>
                                            </div>
                                            <span
                                                className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#19222c]"></span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h2 className="text-gray-900 dark:text-white text-base font-medium">Elara Vance</h2>
                                            <p className="text-green-500 text-xs">Online</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-background-dark">
                                            <span className="material-symbols-outlined text-2xl">call</span>
                                        </button>
                                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-background-dark">
                                            <span className="material-symbols-outlined text-2xl">videocam</span>
                                        </button>
                                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-background-dark">
                                            <span className="material-symbols-outlined text-2xl">more_vert</span>
                                        </button>
                                    </div>
                                </div>
                                {/*<!-- Message Display Area -->*/}
                                <div className="flex flex-col h-full overflow-x-auto p-6 flex-grow">
                                    <div className="grid grid-cols-12 gap-y-2">
                                        {/*<!-- Incoming Message -->*/}
                                        <div className="col-start-1 col-end-9 p-3 rounded-lg">
                                            <div className="flex flex-row items-start">
                                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex-shrink-0"
                                                    data-alt="Avatar of Elara Vance"
                                                   style={{ backgroundImage: ' url("https://lh3.googleusercontent.com/aida-public/AB6AXuAySc4aeUb3TJ-BmMgjFemV5M8FG43q9VBMB8dqbb_FPNQNNmjQZ0fwIy33SO3UyUsnM4WEwIL119oxQ-dXjabWCnm2Sug9f5GLcTyNkTVcTTNMjzTp8HAlUYuFg1T1kziUEaMjiAeYiBl_kSTU7_wwUh-YTgME2JgP0yL91N_7NNI_2wTIX7R2MFZLfvwcltYlHkIQTSz1ZWWhsFaDyk0C12hdOH8FHejOGsTMqKfjdliPXhSKkuLJ-zWCzPhxlfHXG19i498iMOY");'}}>
                                                </div>
                                                <div
                                                    className="relative ml-3 text-sm bg-white dark:bg-[#19222c] py-2 px-4 shadow rounded-xl rounded-bl-none">
                                                    <div>Hey! Just checking in. Are we still on for our meeting at 3 PM tomorrow?
                                                    </div>
                                                    <div className="absolute text-xs bottom-1 right-2 text-gray-400 dark:text-gray-500">
                                                        10:55 AM</div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*<!-- Outgoing Message -->*/}
                                        <div className="col-start-5 col-end-13 p-3 rounded-lg">
                                            <div className="flex items-start justify-start flex-row-reverse">
                                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex-shrink-0"
                                                    data-alt="User avatar"
                                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7GEInhqf-3HKykk-497PzLJ6j-6q2XobUEu6-Cah83Ctw9n_EcBi4qoHHl4H3TtQThO8w7mhbkZbnkhYUcF-jvDEAjqjzrEOzq4QEOgXs7u5LDJmBOA88PWftCOxdGECH94LxOFnGn8cw9jVATVv6VoEhM94qXq0fwibHvMdzJH7CdfBMtOBHBlCRxAHZvTHC1LipCMaI4W4-zp6yl_evnhXG9QQ-WQMPygMioPtK6YLKWMBh_PmLPWaJ97qyyvJnihBKfVN18lU");'}}>
                                                </div>
                                                <div
                                                    className="relative mr-3 text-sm bg-primary text-white py-2 px-4 shadow rounded-xl rounded-br-none">
                                                    <div>Hi Elara! Absolutely. I've got it on my calendar. Looking forward to it.
                                                    </div>
                                                    <div className="absolute text-xs bottom-1 right-2 text-primary-200">10:56 AM</div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*<!-- Incoming Message -->*/}
                                        <div className="col-start-1 col-end-9 p-3 rounded-lg">
                                            <div className="flex flex-row items-start">
                                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex-shrink-0"
                                                    data-alt="Avatar of Elara Vance"
                                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCG1RhB-_wltS0B7jel62CJ_BYI8QHFk_fcRrhau7Sf_Y5HN14qV2ast0eNnEOjS2ITV6yWPWrTYvajmi100EQancL3b7NYxSJ20O5lci_JyfbK3ZvswRNjMmLiWP4XngFzMV0bZVcTL-D5NZwIX8bptgHmNuraQjoH7vFnJuztiAW_onBYj8otuVzMF3RD0gzqnpgvdjxOi99GHp1OLG4ZdVPENp-15Ww55ULhRckLQ3tp_plhCpVD4zSuoBkqOiddbfnODKvc6i4");'}}>
                                                </div>
                                                <div
                                                    className="relative ml-3 text-sm bg-white dark:bg-[#19222c] py-2 px-4 shadow rounded-xl rounded-bl-none">
                                                    <div>Sounds great! See you then.</div>
                                                    <div className="absolute text-xs bottom-1 right-2 text-gray-400 dark:text-gray-500">
                                                        10:57 AM</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*<!-- Message Input Composer -->*/}
                                <div
                                    className="flex flex-row items-center h-20 rounded-xl bg-white dark:bg-[#19222c] w-full px-4 border-t border-gray-200 dark:border-gray-800">
                                    <button
                                        className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-background-dark">
                                        <span className="material-symbols-outlined text-2xl">add_reaction</span>
                                    </button>
                                    <button
                                        className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-background-dark">
                                        <span className="material-symbols-outlined text-2xl">attach_file</span>
                                    </button>
                                    <div className="flex-grow ml-4">
                                        <div className="relative w-full">
                                            <input
                                                className="flex w-full border rounded-xl focus:outline-none focus:border-primary pl-4 h-12 bg-gray-100 dark:bg-background-dark border-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                                placeholder="Type a message..." type="text" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <button
                                            className="flex items-center justify-center bg-primary hover:bg-primary/90 rounded-xl text-white p-3 flex-shrink-0">
                                            <span className="material-symbols-outlined text-2xl">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
};
export default ReportList;