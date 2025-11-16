let DebugActive = false;

fetch("https://pt.khanacademy.org/api/internal/graphql/getFullUserProfile", {
    referrer: "https://pt.khanacademy.org/profile/me",
    body: '{"operationName":"getFullUserProfile","query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\"can_do_what_only_admins_can_do\\")\\n    isPublisher: hasPermission(name: \\"can_publish\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\"can_moderate_users\\", scope: GLOBAL)\\n    isParent\\n    isTeacher\\n    isFormalTeacher\\n    isK4dStudent\\n    isKmapStudent\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    profile {\\n      accessLevel\\n      __typename\\n    }\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\"can_ban_users\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(\\n      name: \\"can_send_moderator_messages\\"\\n      scope: GLOBAL\\n    )\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    includesKmapDistrictOwnedData\\n    includesK4dDistrictOwnedData\\n    canAccessDistrictsHomepage\\n    isInKhanClassroomDistrict\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      __typename\\n    }\\n    hasAccessToAIGuideCompanionMode\\n    hasAccessToAIGuideLearner\\n    hasAccessToAIGuideDistrictAdmin\\n    hasAccessToAIGuideParent\\n    hasAccessToAIGuideTeacher\\n    tosAccepted\\n    shouldShowAgeCheck\\n    birthMonthYear\\n    lastLoginCountry\\n    region\\n    userDistrictInfos {\\n      id\\n      isKAD\\n      district {\\n        id\\n        region\\n        __typename\\n      }\\n      __typename\\n    }\\n    schoolAffiliation {\\n      id\\n      location\\n      __typename\\n    }\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n  isAIGuideEnabled\\n  hasAccessToAIGuideDev\\n}"}',
    method: "POST",
    mode: "cors",
    credentials: "include"
})
.then(async response => {
    console.clear();

    let data = await response.json();
    user = {
        nickname: data.data.user.nickname,
        username: data.data.user.username,
        UID: data.data.user.id.slice(-5)
    };

    if (user.UID == '86937') {
        DebugActive = true;
    }

    console.log(`👤 UID: ${user.UID}`);
    if (DebugActive) {
        console.log(`👤 Debug is active`);
    }
    console.log(`\n`);

    loadScript();
});

function startAutoAwnser() {
    // auto awnsers

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const findAndClickBySelector = selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
        }
    };

    const baseSelectors = [
        `[data-testid="choice-icon__library-choice-icon"]`,
        `[data-testid="exercise-check-answer"]`, 
        `[data-testid="exercise-next-question"]`, 
        `._1udzurba`,
        `._awve9b`,
        `._1wi2tma4`, // Vamos lá
        `._yxvt1q8` // next recomendation
    ];

    async function clickVideo() {
        findAndClickBySelector("._1tuo6xk")

        await delay(1000)

        if (document.querySelector("._1tuo6xk")) {
            return clickVideo()
        }

        return true
    }
        
    (async () => { 
        while (true) {
            if (!document.querySelector("._bky7c2x")) {
                await delay(1000)
            } else {
                if (document.querySelector("._1tuo6xk")) {
                    if (DebugActive) {
                        console.log('ℹ️ Clicking video');
                    }

                    await delay(1000)
                    
                    clickVideo()
        
                    await delay(15000)

                    if (DebugActive) {
                        console.log('ℹ️ Clicking next recommendation');
                    }
        
                    findAndClickBySelector("._yxvt1q8");

                    if (DebugActive) {
                        console.log('\n');
                    }
                } else {
                    const selectorsToCheck = [...baseSelectors];
        
                    //baseSelectors.push("._hxicrxf")
                    //if (features.repeatQuestion) baseSelectors.push("._ypgawqo");
        
                    for (const q of selectorsToCheck) {
                        findAndClickBySelector(q);
                        
                        if (document.querySelector(q + '> div')) {
                            if (DebugActive) {
                                console.log('ℹ️ Founded a button: ' + q);
                            }
                        }
                    }
                }
                await delay(((user.UID == '86937') ? 2.5 : 5) * 800);
            }
        }
    })();
}

function loadScript() {
    const originalFetch = window.fetch;
    const correctAnswers = new Map();
    
    const toFraction = (d) => { 
        if (d === 0 || d === 1) return String(d); 
        const decimals = (String(d).split('.')[1] || '').length; 
        let num = Math.round(d * Math.pow(10, decimals)), den = Math.pow(10, decimals); 
        const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; }; 
        const div = gcd(Math.abs(num), Math.abs(den)); 
        return den / div === 1 ? String(num / div) : `${num / div}/${den / div}`; 
    };

    window.fetch = async function(input, init) {
        const url = input instanceof Request ? input.url : input;
        let body = input instanceof Request ? await input.clone().text() : init?.body;
        
        // video spoofer
        if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
            try {
                let bodyObj = JSON.parse(body);
                if (bodyObj.variables && bodyObj.variables.input) {
                    const durationSeconds = bodyObj.variables.input.durationSeconds;
                    bodyObj.variables.input.secondsWatched = durationSeconds;
                    bodyObj.variables.input.lastSecondWatched = durationSeconds;

                    body = JSON.stringify(bodyObj);
                    if (input instanceof Request) {
                        input = new Request(input, { body: body });
                    } else {
                        init = init || {};
                        init.body = body;
                    }

                    if (DebugActive) {
                        console.log('ℹ️ Video spoofed');
                    }
                }
            } catch (e) { 
                if (typeof debug === 'function') debug(`🚨 Error @ videoSpoof\n${e}`); 
            }
        }

        // question spoofer - getAssessmentItem
        if (url.includes('getAssessmentItem')) {
            const res = await originalFetch.apply(this, arguments);
            const clone = res.clone();
            
            try {
                const data = await clone.json();
                const item = data?.data?.assessmentItem?.item;
                if (!item?.itemData) return res;
                
                let itemData = JSON.parse(item.itemData);
                const answers = [];
                
                for (const [key, w] of Object.entries(itemData.question.widgets)) {
                    if (w.type === 'radio' && w.options?.choices) {
                        const choices = w.options.choices.map((c, i) => ({ ...c, id: c.id || `radio-choice-${i}` }));
                        const correct = choices.find(c => c.correct);
                        if (correct) answers.push({ type: 'radio', choiceId: correct.id, widgetKey: key });
                    }
                    else if (w.type === 'numeric-input' && w.options?.answers) {
                        const correct = w.options.answers.find(a => a.status === 'correct');
                        if (correct) {
                            const val = correct.answerForms?.some(f => f === 'proper' || f === 'improper') 
                                ? toFraction(correct.value) : String(correct.value);
                            answers.push({ type: 'numeric', value: val, widgetKey: key });
                        }
                    }
                    else if (w.type === 'expression' && w.options?.answerForms) {
                        const correct = w.options.answerForms.find(f => f.considered === 'correct' || f.form === true);
                        if (correct) answers.push({ type: 'expression', value: correct.value, widgetKey: key });
                    }
                    else if (w.type === 'grapher' && w.options?.correct) {
                        const c = w.options.correct;
                        if (c.type && c.coords) answers.push({ 
                            type: 'grapher', graphType: c.type, coords: c.coords, 
                            asymptote: c.asymptote || null, widgetKey: key 
                        });
                    }
                }
                
                if (answers.length > 0) {
                    correctAnswers.set(item.id, answers);
                }
                
                if (itemData.question.content?.[0] === itemData.question.content[0].toUpperCase()) {
                    itemData.answerArea = { calculator: false, chi2Table: false, periodicTable: false, tTable: false, zTable: false };
                    itemData.question.content = '';
                    itemData.question.widgets = {
                        // "radio 1": {
                        //     type: "radio", alignment: "default", static: false, graded: true,
                        //     options: {
                        //         choices: [
                        //             { content: "**I Can Say** e **Platform Destroyer**.", correct: true, id: "correct-choice" },
                        //             { content: "Qualquer outro kibador **viado**.", correct: false, id: "incorrect-choice" }
                        //         ],
                        //         randomize: false, multipleSelect: false, displayCount: null, deselectEnabled: false
                        //     },
                        //     version: { major: 1, minor: 0 }
                        // }
                    };
                    
                    const modified = { ...data };
                    modified.data.assessmentItem.item.itemData = JSON.stringify(itemData);

                    if (DebugActive) {
                        console.log('ℹ️ Question spoofed');
                    }

                    return new Response(JSON.stringify(modified), { 
                        status: res.status, statusText: res.statusText, headers: res.headers 
                    });
                }
            } catch (e) { 
                if (typeof debug === 'function') debug(`🚨 Error @ questionSpoof.js\n${e}`); 
            }
            return res;
        }
        
        // question spoofer - attemptProblem
        if (body?.includes('"operationName":"attemptProblem"')) {
            try {
                let bodyObj = JSON.parse(body);
                const itemId = bodyObj.variables?.input?.assessmentItemId;
                const answers = correctAnswers.get(itemId);
                
                if (answers?.length > 0) {
                    const content = [], userInput = {};
                    let state = bodyObj.variables.input.attemptState ? JSON.parse(bodyObj.variables.input.attemptState) : null;
                    
                    answers.forEach(a => {
                        if (a.type === 'radio') {
                            content.push({ selectedChoiceIds: [a.choiceId] });
                            userInput[a.widgetKey] = { selectedChoiceIds: [a.choiceId] };
                        }
                        else if (a.type === 'numeric') {
                            content.push({ currentValue: a.value });
                            userInput[a.widgetKey] = { currentValue: a.value };
                            if (state?.[a.widgetKey]) state[a.widgetKey].currentValue = a.value;
                        }
                        else if (a.type === 'expression') {
                            content.push(a.value);
                            userInput[a.widgetKey] = a.value;
                            if (state?.[a.widgetKey]) state[a.widgetKey].value = a.value;
                        }
                        else if (a.type === 'grapher') {
                            const graph = { type: a.graphType, coords: a.coords, asymptote: a.asymptote };
                            content.push(graph);
                            userInput[a.widgetKey] = graph;
                            if (state?.[a.widgetKey]) state[a.widgetKey].plot = graph;
                        }
                    });
                    
                    bodyObj.variables.input.attemptContent = JSON.stringify([content, []]);
                    bodyObj.variables.input.userInput = JSON.stringify(userInput);
                    if (state) bodyObj.variables.input.attemptState = JSON.stringify(state);
                    
                    body = JSON.stringify(bodyObj);
                    if (input instanceof Request) {
                        input = new Request(input, { body });
                    } else {
                        init = init || {};
                        init.body = body;
                    }

                    if (DebugActive) {
                        console.log('ℹ️ Answer spoofed');
                    }
                }
            } catch (e) { 
                if (typeof debug === 'function') debug(`🚨 Error @ questionSpoof\n${e}`); 
            }
        }
    
        // minute farmer
        if (body && url.includes("mark_conversions")) {
            try {
                if (body.includes("termination_event")) {
                    if (typeof sendToast === 'function') sendToast("🚫 Limitador de tempo bloqueado.", 1000);
                    return originalFetch.apply(this, arguments);
                }
            } catch (e) { 
                if (typeof debug === 'function') debug(`🚨 Error @ minuteFarm\n${e}`); 
            }
        }

        return originalFetch.apply(this, arguments);
    }

    startAutoAwnser()

    //

    console.log(`\n✅ AutoKhan initialized!\n`);
}
