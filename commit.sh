if [ -z "$*" ]
then
    echo "Usage: "
    echo "    commit.sh <commit message>"
    exit
fi

echo "-------------------------------------------------------------------------"
echo "Your commit message: $*"
echo ""
echo "-------------------------------------------------------------------------"
echo "The following files would be added to the repository:"
echo ""
git add -A --dry-run

echo ""
echo "-------------------------------------------------------------------------"
echo "The following changes would be committed:"
echo ""
git commit -a -m "$*" --dry-run

echo ""
echo "-------------------------------------------------------------------------"
read -p "Proceed to commit? " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "...adding files"
    git add -A
    echo "...commit changes"
    git commit -a -m "$*"
    echo "...preparing controlfile"
    ./prepare_update.sh
    echo "...commit controlfile"
    git commit -a -m "$*"
    echo "...pull from github"
    git pull
    echo "...push to github"
    git push
fi

echo "done"