all:
	@echo "Makefile"

#######
# API #
#######

install_api:
	cd api && pip install -r requirements.txt

install_test_api:
	cd api && pip install -r requirements.test.txt

package_api:
	chmod u+x ./package-api.sh
	./package-api.sh

test_api:
	python -m pytest

######
# UI #
######

ui_install:
	cd webui && npm install

build_ui: ui_install
	cd webui && npm run build

dev_ui: ui_install
	cd webui && npm run dev

######
# CI #
######

iac_init:
	cd terraform && terraform init

iac_apply:
	cd terraform && terraform apply

deploy: package_api iac_apply



clean:
	rm -rf dist/
	rm -rf .temp/
