#!/bin/bash

echo "Iniciando Elasticsearch Search Service..."

#verificar se Docker está rodando, para garantir que tudo será construido
if ! docker info > /dev/null 2>&1; then
  echo "Docker não está rodando. Inicie o Docker Desktop e tente novamente."
  exit 1
fi

#sobe o elasticsearch em conjunto com o docker
echo "Subindo Elasticsearch com Docker..."
docker-compose up -d

#aguarda o elasticsearch estar disponível
echo "Aguardando Elasticsearch responder na porta 9200..."
for i in {1..30}; do
  if curl -s http://localhost:9200 > /dev/null; then
    echo "Elasticsearch está pronto!"
    break
  fi
  sleep 1
  if [ $i -eq 30 ]; then
    echo "Timeout: Elasticsearch não respondeu após 30s"
    exit 1
  fi
done

#instala dependências
echo "Instalando dependências..."
yarn install

#executa o seed
echo "Rodando seed para criar índice e inserir dados..."
yarn run seed

#verifique se o express está instalado como dependência principal
echo "Verifique se o express está instalado..."
yarn add express

#sobe o servidor
echo "Iniciando servidor Express..."
yarn dev
