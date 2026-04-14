      // Variables globales
      let currentSlide = 1;
      const totalSlides = 15;
      let touchStartX = 0;
      let touchEndX = 0;

      // Inicialización
      document.addEventListener("DOMContentLoaded", function () {
        updateProgressBar();
        generateBinaryRain();
        generateParticles();
        fillComparisonTable();

        // Teclado
        document.addEventListener("keydown", function (e) {
          if (e.key === "ArrowRight" || e.key === " ") nextSlide();
          if (e.key === "ArrowLeft") prevSlide();
        });

        // Touch events
        document.addEventListener(
          "touchstart",
          (e) => (touchStartX = e.changedTouches[0].screenX),
        );
        document.addEventListener("touchend", (e) => {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe();
        });
      });

      // Navegación
      function goToSlide(n) {
        if (n < 1 || n > totalSlides) return;

        const slides = document.querySelectorAll(".slide");
        slides.forEach((slide, index) => {
          slide.classList.remove("active", "prev");
          if (index + 1 === currentSlide && n > currentSlide) {
            slide.classList.add("prev");
          }
        });

        currentSlide = n;
        document.getElementById("currentSlide").textContent = currentSlide;

        const activeSlide = document.querySelector(
          `[data-slide="${currentSlide}"]`,
        );
        if (activeSlide) {
          activeSlide.classList.add("active");
          // Scroll al top
          activeSlide.scrollTop = 0;
        }

        updateProgressBar();
      }

      function nextSlide() {
        if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
      }

      function prevSlide() {
        if (currentSlide > 1) goToSlide(currentSlide - 1);
      }

      function updateProgressBar() {
        const progress = (currentSlide / totalSlides) * 100;
        document.getElementById("progressBar").style.width = progress + "%";
      }

      function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
      }

      // Efectos visuales
      function generateBinaryRain() {
        const container = document.getElementById("binaryRain");
        const columns = Math.floor(window.innerWidth / 20);

        for (let i = 0; i < columns; i++) {
          const column = document.createElement("div");
          column.className = "binary-column";
          column.style.left = i * 20 + "px";
          column.style.animationDuration = Math.random() * 3 + 2 + "s";
          column.style.animationDelay = Math.random() * 2 + "s";

          let content = "";
          for (let j = 0; j < 20; j++) {
            content += Math.random() > 0.5 ? "1" : "0";
            content += "<br>";
          }
          column.innerHTML = content;
          container.appendChild(column);
        }
      }

      function generateParticles() {
        const container = document.getElementById("particles");
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement("div");
          particle.className = "particle";
          particle.style.left = Math.random() * 100 + "%";
          particle.style.animationDelay = Math.random() * 10 + "s";
          particle.style.animationDuration = Math.random() * 10 + 10 + "s";
          container.appendChild(particle);
        }
      }

      // Interacciones
      function expandCard(card) {
        card.classList.toggle("expanded");
      }

      function toggleCard(card) {
        card.classList.toggle("expanded");
      }

      function switchTab(tabName) {
        // Ocultar todos los contenidos
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active");
        });

        // Desactivar todos los botones
        document.querySelectorAll(".tab-btn").forEach((btn) => {
          btn.classList.remove("active");
        });

        // Activar el seleccionado
        document.getElementById(tabName).classList.add("active");
        event.target.classList.add("active");
      }

      // Calculadora
      function convertNumber() {
        const input = document.getElementById("inputNumber").value.trim();
        const fromBase = parseInt(document.getElementById("fromBase").value);
        const toBase = parseInt(document.getElementById("toBase").value);
        const resultBox = document.getElementById("conversionResult");

        if (!input) {
          resultBox.innerHTML = "Por favor ingresa un número";
          return;
        }

        try {
          // Convertir a decimal primero
          let decimal;
          if (fromBase === 10) {
            decimal = parseInt(input);
          } else {
            decimal = parseInt(input, fromBase);
          }

          if (isNaN(decimal)) throw new Error("Número inválido");

          // Convertir de decimal a base destino
          let result;
          if (toBase === 10) {
            result = decimal.toString();
          } else {
            result = decimal.toString(toBase).toUpperCase();
          }

          // Mostrar paso a paso
          let explanation = "";
          if (fromBase !== 10 && toBase !== 10) {
            explanation = `<br><small style="color: #94a3b8;">Paso intermedio: ${input} (${fromBase}) = ${decimal} (10) = ${result} (${toBase})</small>`;
          } else if (fromBase === 10) {
            explanation = `<br><small style="color: #94a3b8;">División sucesiva por ${toBase}</small>`;
          } else {
            explanation = `<br><small style="color: #94a3b8;">Suma ponderada: Σ(dígito × ${fromBase}^pos)</small>`;
          }

          resultBox.innerHTML = `<strong style="color: var(--accent); font-size: 1.4rem;">${result}</strong>${explanation}`;
        } catch (e) {
          resultBox.innerHTML = "Error: " + e.message;
        }
      }

      // Tabla comparativa
      function fillComparisonTable() {
        const tbody = document.getElementById("comparisonTableBody");
        for (let i = 0; i <= 15; i++) {
          const row = document.createElement("tr");
          const binary = i.toString(2).padStart(4, "0");
          const octal = i.toString(8);
          const hex = i.toString(16).toUpperCase();

          row.innerHTML = `
                    <td><strong>${i}</strong></td>
                    <td style="font-family: monospace;">${binary}</td>
                    <td style="font-family: monospace;">${octal}</td>
                    <td style="font-family: monospace; color: var(--accent);">${hex}</td>
                `;
          tbody.appendChild(row);
        }
      }

      // Información de componentes
      function showComponentInfo(component) {
        const infoDiv = document.getElementById("componentInfo");
        const info = {
          cpu: {
            title: "CPU (Unidad Central de Proceso)",
            content:
              'El "cerebro" del computador. Contiene la ALU (Unidad Aritmético-Lógica) para operaciones matemáticas, la Unidad de Control (CU) para dirigir el flujo de datos, y registros temporales de alta velocidad. En el 8086, se divide en BIU (Bus Interface Unit) y EU (Execution Unit) trabajando en paralelo.',
          },
          memory: {
            title: "Sistema de Memoria",
            content:
              "Jerarquía de almacenamiento: Registros (ns) → Caché L1/L2/L3 (1-10 ns) → RAM Principal (50-100 ns) → Almacenamiento Secundario (HDD/SSD). La memoria es volátil (RAM) o no volátil (ROM/SSD). El bus de direcciones de 20 bits del 8086 permite acceder a 1 MB.",
          },
          io: {
            title: "Entrada/Salida (E/S)",
            content:
              "Dispositivos periféricos que comunican el CPU con el exterior. Incluyen controladores DMA (acceso directo a memoria sin CPU), controladores de interrupciones (PIC 8259), y buses de expansión (USB, SATA, PCIe). La E/S puede ser mapeada en memoria o por puertos específicos.",
          },
        };

        const data = info[component];
        infoDiv.innerHTML = `<h3 style="color: var(--accent); margin-bottom: 10px;">${data.title}</h3><p>${data.content}</p>`;
        infoDiv.style.display = "block";
      }

      // Información de registros
      function showRegisterInfo(reg) {
        const infoDiv = document.getElementById("registerInfo");
        const info = {
          AX: "Acumulador: Usado en operaciones aritméticas (MUL, DIV), operaciones de E/S (IN, OUT), y transferencias de datos. Es el registro implícito para muchas operaciones.",
          BX: "Base: Usado como puntero a datos en memoria. DS:BX apunta a datos. Puede direccionar memoria indirectamente.",
          CX: "Contador: Usado en bucles (LOOP), desplazamientos (CL contiene el número de bits a rotar), y operaciones de cadenas (REP).",
          DX: "Datos: Usado como extensión de AX en multiplicación/división de 32 bits. También para dirección de puerto en IN/OUT DX.",
          CS: "Code Segment: Contiene la dirección base del segmento de código. CS:IP apunta a la siguiente instrucción a ejecutar.",
          DS: "Data Segment: Segmento por defecto para acceso a datos. La mayoría de instrucciones usan DS implícitamente.",
          SS: "Stack Segment: Base de la pila del programa. SS:SP apunta a la cima de la pila.",
          ES: "Extra Segment: Segmento adicional para operaciones de cadenas (destino en MOVS).",
          SP: "Stack Pointer: Apunta a la cima de la pila. Se decrementa en PUSH e incrementa en POP.",
          BP: "Base Pointer: Usado para acceder a parámetros de funciones en la pila. SS:BP apunta al marco de pila.",
          SI: "Source Index: Índice fuente en operaciones de cadenas (LODS, MOVS). DS:SI apunta al origen.",
          DI: "Destination Index: Índice destino en operaciones de cadenas (STOS, MOVS). ES:DI apunta al destino.",
          IP: "Instruction Pointer: Apunta a la siguiente instrucción a ejecutar (offset dentro de CS). Se incrementa automáticamente.",
        };

        infoDiv.innerHTML = `<strong style="color: var(--accent);">${reg}:</strong> ${info[reg]}`;
        infoDiv.style.display = "block";
      }

      // Permitir Enter en calculadora
      document.addEventListener("DOMContentLoaded", function () {
        const input = document.getElementById("inputNumber");
        if (input) {
          input.addEventListener("keypress", function (e) {
            if (e.key === "Enter") convertNumber();
          });
        }
      });

        // Función adicional para modos de direccionamiento
        function showAddressingMode(card, mode) {
            // Expandir tarjeta
            card.classList.toggle('expanded');
            
            // Mostrar detalle
            const detailDiv = document.getElementById('addressingDetail');
            const details = {
                inmediato: {
                    title: 'Direccionamiento Inmediato',
                    desc: 'El operando es parte de la instrucción. Rápido pero inflexible.',
                    ejemplo: 'MOV AX, 5  ; AX = 5',
                    uso: 'Inicialización de constantes, contadores'
                },
                registro: {
                    title: 'Direccionamiento por Registro',
                    desc: 'Ambos operandos en registros internos. El más rápido.',
                    ejemplo: 'MOV AX, BX  ; AX = BX',
                    uso: 'Operaciones aritméticas, transferencias rápidas'
                },
                directo: {
                    title: 'Direccionamiento Directo',
                    desc: 'Dirección de memoria es constante en la instrucción.',
                    ejemplo: 'MOV AX, [1000h]  ; AX = contenido de DS:1000h',
                    uso: 'Variables globales, acceso a memoria fija'
                },
                indirecto: {
                    title: 'Direccionamiento Indirecto',
                    desc: 'Dirección almacenada en registro BX, BP, SI o DI.',
                    ejemplo: 'MOV AX, [BX]  ; AX = contenido de DS:BX',
                    uso: 'Punteros, recorrido de arreglos'
                },
                basico: {
                    title: 'Direccionamiento Indexado',
                    desc: 'Registro índice (SI/DI) más desplazamiento constante.',
                    ejemplo: 'MOV AX, [SI+4]  ; Accede a campo de estructura',
                    uso: 'Estructuras de datos, registros, campos'
                },
                complejo: {
                    title: 'Direccionamiento Base-Índice',
                    desc: 'Combinación de base (BX/BP), índice (SI/DI) y desplazamiento.',
                    ejemplo: 'MOV AX, [BX+SI+2]  ; Acceso a matriz 2D',
                    uso: 'Matrices bidimensionales, pilas de activación'
                }
            };
            
            const info = details[mode];
            detailDiv.innerHTML = `
                <h3 style="color: var(--accent); margin-bottom: 10px;">${info.title}</h3>
                <p style="margin-bottom: 10px;">${info.desc}</p>
                <code style="display: block; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; margin: 10px 0;">${info.ejemplo}</code>
                <p style="color: #94a3b8; font-size: 0.9rem;"><strong>Uso típico:</strong> ${info.uso}</p>
            `;
            detailDiv.style.display = 'block';
        }

        // Inicializar con animación de entrada
        document.addEventListener('DOMContentLoaded', function() {
            // Animación inicial
            setTimeout(() => {
                document.querySelector('.slide.active').style.opacity = '1';
            }, 100);
        });
