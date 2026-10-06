// --- SETUP THREE.JS SCENE ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0c10);
scene.fog = new THREE.FogExp2(0x0b0c10, 0.03);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// --- ILUMINAÇÃO AMBIENTE & DIRECIONAL ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x00ffcc, 0.8);
dirLight.position.set(20, 40, 20);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const pointLight = new THREE.PointLight(0xff00ff, 1, 30);
pointLight.position.set(0, 5, 0);
scene.add(pointLight);

// --- CHÃO / MAPA 3D ---
const floorGeo = new THREE.PlaneGeometry(60, 60);
const floorMat = new THREE.MeshStandardMaterial({ 
    color: 0x1e1e2e, 
    roughness: 0.8, 
    metalness: 0.2 
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Grid Visual
const grid = new THREE.GridHelper(60, 30, 0x00ffcc, 0x334155);
grid.position.y = 0.01;
scene.add(grid);

// Paredes
const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
const createWall = (w, h, d, x, y, z) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
};

createWall(60, 4, 1, 0, 2, -30);
createWall(60, 4, 1, 0, 2, 30);
createWall(1, 4, 60, -30, 2, 0);
createWall(1, 4, 60, 30, 2, 0);

// --- JOGADOR 3D ---
const playerGroup = new THREE.Group();

// Corpo
const bodyGeo = new THREE.BoxGeometry(1, 1.6, 1);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, roughness: 0.3 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = 0.8;
body.castShadow = true;
playerGroup.add(body);

// Olhos
const eyeGeo = new THREE.BoxGeometry(0.2, 0.2, 0.1);
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
eye1.position.set(-0.25, 1.1, -0.51);
const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
eye2.position.set(0.25, 1.1, -0.51);
playerGroup.add(eye1);
playerGroup.add(eye2);

playerGroup.position.set(0, 0, 15);
scene.add(playerGroup);

// --- ZONAS INTERATIVAS 3D (PODIUMS / MONUMENTOS) ---
const interactiveZones = [
    {
        id: 'bio',
        x: 0, z: 0,
        color: 0x00ffcc,
        title: '🗿 Estátua de Júlio César',
        content: `
            <h4>Desenvolvedor & Gestor de TI</h4>
            <p>Olá! Sou o Júlio César Mendes da Silva. Bem-vindo ao meu portfólio 3D!</p>
            <p>📍 <strong>Localização:</strong> Assis, SP</p>
            <p>🎯 <strong>Objetivo:</strong> Iniciar minha carreira profissional em TI, aplicando minha base em Gestão de TI e Análise e Desenvolvimento de Sistemas.</p>
        `
    },
    {
        id: 'skills',
        x: -15, z: -15,
        color: 0xfbbf24,
        title: '💻 Hall de Hard Skills',
        content: `
            <h4>Minhas Competências Técnicas</h4>
            <div>
                <span class="tag">Python</span><span class="tag">JavaScript</span><span class="tag">HTML/CSS</span>
                <span class="tag">SQL / Dados</span><span class="tag">Git/GitHub</span><span class="tag">Inteligência Artificial</span>
                <span class="tag">Redes</span><span class="tag">Mobile</span>
            </div>
            <h4 style="margin-top:15px;">Soft Skills</h4>
            <p>Aprendizado Contínuo, Empatia, Inteligência Emocional, Resiliência e Adaptabilidade.</p>
        `
    },
    {
        id: 'education',
        x: 15, z: -15,
        color: 0xf43f5e,
        title: '🎓 Academia de Formação',
        content: `
            <h4>Formação Acadêmica</h4>
            <ul>
                <li><strong>Graduação em Gestão da TI:</strong> FATEC SP (2º Semestre)</li>
                <li><strong>Técnico em ADS:</strong> ETEC Amélia Araújo</li>
            </ul>
            <h4>Cursos e Certificados</h4>
            <ul>
                <li><strong>CS50P (Harvard):</strong> Programação em Python</li>
                <li><strong>Trilha GenAI & Dados:</strong> Fundação Bradesco & DIO (52h)</li>
                <li><strong>Do Prompt ao Agente:</strong> CI&T & DIO (35h)</li>
            </ul>
        `
    },
    {
        id: 'languages',
        x: -15, z: 12,
        color: 0x38bdf8,
        title: '🌐 Idiomas & Voluntariado',
        content: `
            <h4>Idiomas</h4>
            <ul>
                <li>🇨🇦 <strong>Inglês:</strong> Fluente C1 (Intercâmbio UMC - Toronto, Canadá)</li>
                <li>🇪🇸 <strong>Espanhol:</strong> Fluente C1</li>
                <li>🇫🇷 <strong>Francês:</strong> Básico II (A2)</li>
                <li>🇯🇵 <strong>Japonês:</strong> Básico II (A2)</li>
            </ul>
            <h4>Voluntariado</h4>
            <ul>
                <li><strong>Cidadão Pró-Mundo (CPM):</strong> Professor voluntário de Inglês.</li>
            </ul>
        `
    },
    {
        id: 'contact',
        x: 15, z: 12,
        color: 0x22c55e,
        title: '✉️ Terminal de Contato',
        content: `
            <h4>Entre em Contato!</h4>
            <ul>
                <li>📧 <strong>E-mail:</strong> <a href="mailto:jcmsilva.1707@gmail.com">jcmsilva.1707@gmail.com</a></li>
                <li>📱 <strong>Telefone:</strong> (11) 98973-7895</li>
                <li>💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/júlio-césar-mendes-da-silva-IA17" target="_blank">Perfil LinkedIn</a></li>
                <li>🐙 <strong>GitHub:</strong> <a href="https://github.com/Ju-LI0" target="_blank">github.com/Ju-LI0</a></li>
            </ul>
        `
    }
];

const zoneMeshes = [];

interactiveZones.forEach(zone => {
    // Base
    const baseGeo = new THREE.CylinderGeometry(2.5, 3, 0.8, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: zone.color, roughness: 0.3 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(zone.x, 0.4, zone.z);
    baseMesh.receiveShadow = true;
    scene.add(baseMesh);

    // Cristal Flutuante
    const gemGeo = new THREE.OctahedronGeometry(1.2);
    const gemMat = new THREE.MeshStandardMaterial({ 
        color: zone.color, 
        emissive: zone.color, 
        emissiveIntensity: 0.4,
        roughness: 0.1 
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.position.set(zone.x, 2.8, zone.z);
    gemMesh.castShadow = true;
    scene.add(gemMesh);

    // Luz da Zona
    const light = new THREE.PointLight(zone.color, 1.5, 10);
    light.position.set(zone.x, 3, zone.z);
    scene.add(light);

    zoneMeshes.push({ gem: gemMesh, zone: zone });
});

// --- CONTROLES TECLADO & MOVIMENTO ---
const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false };
let currentNearZone = null;

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key) || keys.hasOwnProperty(e.key.toLowerCase())) {
        keys[e.key] = true;
        keys[e.key.toLowerCase()] = true;
    }
    if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        checkInteraction();
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key) || keys.hasOwnProperty(e.key.toLowerCase())) {
        keys[e.key] = false;
        keys[e.key.toLowerCase()] = false;
    }
});

// --- LOOP DE ANIMAÇÃO ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Animar Cristais Flutuantes
    zoneMeshes.forEach(item => {
        item.gem.rotation.y += 0.015;
        item.gem.position.y = 2.8 + Math.sin(time * 2 + item.zone.x) * 0.3;
    });

    // Movimento do Jogador
    let moveX = 0;
    let moveZ = 0;
    const speed = 12 * delta;

    if (keys.w || keys.ArrowUp) moveZ -= 1;
    if (keys.s || keys.ArrowDown) moveZ += 1;
    if (keys.a || keys.ArrowLeft) moveX -= 1;
    if (keys.d || keys.ArrowRight) moveX += 1;

    if (moveX !== 0 || moveZ !== 0) {
        const angle = Math.atan2(moveX, moveZ);
        playerGroup.rotation.y = angle;

        const nextX = playerGroup.position.x + moveX * speed;
        const nextZ = playerGroup.position.z + moveZ * speed;

        // Limites da Sala 3D
        if (Math.abs(nextX) < 28) playerGroup.position.x = nextX;
        if (Math.abs(nextZ) < 28) playerGroup.position.z = nextZ;
    }

    // Câmera 3D Seguidora (Estilo RPG)
    camera.position.x = playerGroup.position.x;
    camera.position.y = playerGroup.position.y + 14;
    camera.position.z = playerGroup.position.z + 16;
    camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1, playerGroup.position.z);

    // Checar Proximidade das Zonas
    currentNearZone = null;
    for (const item of interactiveZones) {
        const dist = Math.hypot(playerGroup.position.x - item.x, playerGroup.position.z - item.z);
        if (dist < 4.5) {
            currentNearZone = item;
            break;
        }
    }

    const promptEl = document.getElementById('interaction-prompt');
    if (currentNearZone) {
        promptEl.style.display = 'block';
        promptEl.innerText = `[ESPAÇO/E] Interagir com: ${currentNearZone.title}`;
    } else {
        promptEl.style.display = 'none';
    }

    renderer.render(scene, camera);
}

// --- INTERAÇÃO & MODAIS ---
function checkInteraction() {
    if (currentNearZone) {
        document.getElementById('modalTitle').innerText = currentNearZone.title;
        document.getElementById('modalBody').innerHTML = currentNearZone.content;
        document.getElementById('infoModal').style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
}

function openRecruiterModal() {
    document.getElementById('recruiterModal').style.display = 'block';
}

function closeRecruiterModal() {
    document.getElementById('recruiterModal').style.display = 'none';
}

// Suporte a Touch Mobile
document.getElementById('btn-action').addEventListener('click', checkInteraction);

// Resize Responsivo
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();