all:
	@echo "Makefile"

#######
# API #
#######

package_api:
	chmod u+x ./package-api.sh
	./package-api.sh

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

iac_apply:
	cd terraform && terraform apply

deploy: package_api iac_apply



clean:
	rm -rf dist/
	rm -rf .temp/
