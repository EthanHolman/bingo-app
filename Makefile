all:
	@echo "Makefile"

package_api:
	chmod u+x ./package-api.sh
	./package-api.sh

iac_apply:
	cd terraform && terraform apply

clean:
	rm -rf dist/
	rm -rf .temp/
