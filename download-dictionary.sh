yum install wget
rm -R dict
mkdir dict
files=('base.dat.gz' 'cc.dat.gz' 'check.dat.gz' 'tid.dat.gz' 'tid_map.dat.gz' 'tid_pos.dat.gz' 'unk.dat.gz' 'unk_char.dat.gz' 'unk_compat.dat.gz' 'unk_invoke.dat.gz' 'unk_map.dat.gz' 'unk_pos.dat.gz')
for i in "${files[@]}" 
do
    wget -O "dict/$i" -c "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/$i"
done