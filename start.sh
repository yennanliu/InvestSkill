#!/bin/bash
# ============================================================
# InvestSkill — Script de inicio
# Uso: ./start.sh [app|telegram|whatsapp|all]
# ============================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
ROJO='\033[0;31m'
AZUL='\033[0;34m'
NC='\033[0m'

banner() {
  echo -e "${AZUL}"
  echo "  ██╗███╗   ██╗██╗   ██╗███████╗███████╗████████╗"
  echo "  ██║████╗  ██║██║   ██║██╔════╝██╔════╝╚══██╔══╝"
  echo "  ██║██╔██╗ ██║██║   ██║█████╗  ███████╗   ██║   "
  echo "  ██║██║╚██╗██║╚██╗ ██╔╝██╔══╝  ╚════██║   ██║   "
  echo "  ██║██║ ╚████║ ╚████╔╝ ███████╗███████║   ██║   "
  echo "  ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚══════╝   ╚═╝   "
  echo "  ███████╗██╗  ██╗██╗██╗     ██╗                  "
  echo "  ██╔════╝██║ ██╔╝██║██║     ██║                  "
  echo "  ███████╗█████╔╝ ██║██║     ██║                  "
  echo "  ╚════██║██╔═██╗ ██║██║     ██║                  "
  echo "  ███████║██║  ██╗██║███████╗███████╗             "
  echo "  ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝  v2.0.0    "
  echo -e "${NC}"
  echo -e "  ${VERDE}Plataforma de Análisis de Inversiones en Tiempo Real${NC}"
  echo ""
}

verificar_entorno() {
  echo -e "${AMARILLO}▶ Verificando entorno...${NC}"

  # Python
  if ! command -v python3 &>/dev/null; then
    echo -e "${ROJO}✗ Python 3 no encontrado. Instala Python 3.9+${NC}"
    exit 1
  fi
  echo -e "  ${VERDE}✓ Python $(python3 --version | awk '{print $2}')${NC}"

  # .env
  if [ ! -f ".env" ]; then
    echo -e "  ${AMARILLO}⚠ Archivo .env no encontrado. Copiando desde .env.example...${NC}"
    cp .env.example .env
    echo -e "  ${AMARILLO}  → Edita .env con tus claves API antes de usar funciones avanzadas${NC}"
  else
    echo -e "  ${VERDE}✓ Archivo .env encontrado${NC}"
  fi

  # Dependencias
  if ! python3 -c "import streamlit" &>/dev/null; then
    echo -e "  ${AMARILLO}⚠ Instalando dependencias...${NC}"
    pip3 install -r requirements.txt -q
    echo -e "  ${VERDE}✓ Dependencias instaladas${NC}"
  else
    echo -e "  ${VERDE}✓ Dependencias OK${NC}"
  fi
}

iniciar_app() {
  echo -e "\n${VERDE}▶ Iniciando aplicación web en http://localhost:8501${NC}\n"
  streamlit run app/main.py \
    --server.port 8501 \
    --server.address localhost \
    --browser.gatherUsageStats false \
    --theme.primaryColor "#1a73e8" \
    --theme.backgroundColor "#0e1117" \
    --theme.secondaryBackgroundColor "#1e2530" \
    --theme.textColor "#ffffff"
}

iniciar_telegram() {
  echo -e "\n${VERDE}▶ Iniciando bot de Telegram...${NC}\n"
  python3 bots/telegram_bot.py
}

iniciar_whatsapp() {
  echo -e "\n${VERDE}▶ Iniciando webhook de WhatsApp en puerto 5000...${NC}\n"
  python3 bots/whatsapp_bot.py
}

iniciar_todo() {
  echo -e "\n${VERDE}▶ Iniciando todos los servicios...${NC}\n"
  python3 bots/telegram_bot.py &
  TELEGRAM_PID=$!
  python3 bots/whatsapp_bot.py &
  WHATSAPP_PID=$!
  echo -e "  ${VERDE}✓ Telegram PID: $TELEGRAM_PID${NC}"
  echo -e "  ${VERDE}✓ WhatsApp PID: $WHATSAPP_PID${NC}"
  iniciar_app
}

# ── Menú principal ───────────────────────────────────────────
banner
verificar_entorno

MODO="${1:-app}"

case "$MODO" in
  app)       iniciar_app ;;
  telegram)  iniciar_telegram ;;
  whatsapp)  iniciar_whatsapp ;;
  all)       iniciar_todo ;;
  *)
    echo -e "${ROJO}Uso: ./start.sh [app|telegram|whatsapp|all]${NC}"
    echo "  app       → Solo la interfaz web Streamlit (defecto)"
    echo "  telegram  → Solo el bot de Telegram"
    echo "  whatsapp  → Solo el webhook de WhatsApp"
    echo "  all       → Todo simultáneamente"
    exit 1
    ;;
esac
