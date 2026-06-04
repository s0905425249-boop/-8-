

import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

public class MyFilterApp extends JFrame implements ActionListener, ChangeListener {

    JLabel imageLabel;
    JButton openBtn, grayBtn, blurBtn, edgeBtn, saveBtn, resetBtn;
    JSlider brightSlider, contrastSlider;
    JLabel brightValue, contrastValue;

    BufferedImage originalImage;
    BufferedImage currentImage;

    public MyFilterApp() {

        setTitle("My Filter App");
        setSize(800, 600);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        imageLabel = new JLabel("", JLabel.CENTER);
        add(new JScrollPane(imageLabel), BorderLayout.CENTER);

        JPanel topPanel = new JPanel();

        openBtn = new JButton("開啟圖片");
        grayBtn = new JButton("灰階");
        blurBtn = new JButton("模糊");
        edgeBtn = new JButton("邊緣");
        saveBtn = new JButton("儲存");
        resetBtn = new JButton("復原");

        openBtn.addActionListener(this);
        grayBtn.addActionListener(this);
        blurBtn.addActionListener(this);
        edgeBtn.addActionListener(this);
        saveBtn.addActionListener(this);
        resetBtn.addActionListener(this);

        topPanel.add(openBtn);
        topPanel.add(grayBtn);
        topPanel.add(blurBtn);
        topPanel.add(edgeBtn);
        topPanel.add(saveBtn);
        topPanel.add(resetBtn);

        add(topPanel, BorderLayout.NORTH);

        JPanel bottomPanel = new JPanel();

        brightSlider = new JSlider(-100, 100, 0);
        contrastSlider = new JSlider(50, 150, 100);
        
        brightValue = new JLabel("0");
        contrastValue = new JLabel("100%");
        
        brightSlider.addChangeListener(this);
        contrastSlider.addChangeListener(this);

        bottomPanel.add(new JLabel("亮度"));
        bottomPanel.add(brightSlider);
        bottomPanel.add(brightValue);

        bottomPanel.add(new JLabel("對比"));
        bottomPanel.add(contrastSlider);
        bottomPanel.add(contrastValue);

        add(bottomPanel, BorderLayout.SOUTH);

        setVisible(true);
    }

    public void actionPerformed(ActionEvent e) {
    	
    	if (e.getSource() == resetBtn) {

    	    if (originalImage == null)
    	        return;

    	    currentImage = copyImage(originalImage);

    	    brightSlider.setValue(0);
    	    contrastSlider.setValue(100);

    	    showImage(currentImage);

    	    return;
    	}
        if (e.getSource() == openBtn) {

            JFileChooser chooser = new JFileChooser();

            int result = chooser.showOpenDialog(this);

            if (result == JFileChooser.APPROVE_OPTION) {

                try {

                    File file = chooser.getSelectedFile();
                    System.out.println(file.getAbsolutePath());
                    System.out.println("選擇檔案：" + file.getAbsolutePath());

                    originalImage = ImageIO.read(file);

                    if (originalImage == null) {

                        JOptionPane.showMessageDialog(
                                this,
                                "無法讀取此圖片格式！\n請改用 JPG 或 PNG。");

                        return;
                    }

                    currentImage = copyImage(originalImage);

                    showImage(currentImage);

                    JOptionPane.showMessageDialog(
                            this,
                            "圖片載入成功！");

                } catch (Exception ex) {

                    ex.printStackTrace();

                    JOptionPane.showMessageDialog(
                            this,
                            "圖片載入失敗！\n" + ex.getMessage());
                }
            }
        }

        if (currentImage == null)
            return;

        if (e.getSource() == grayBtn) {
            grayFilter();
        }

        if (e.getSource() == blurBtn) {
            blurFilter();
        }

        if (e.getSource() == edgeBtn) {
            edgeFilter();
        }

        if (e.getSource() == saveBtn) {

            JFileChooser chooser = new JFileChooser();

            if (chooser.showSaveDialog(this)
                    == JFileChooser.APPROVE_OPTION) {

                try {

                    File file = chooser.getSelectedFile();

                    ImageIO.write(
                            currentImage,
                            "png",
                            file);

                    JOptionPane.showMessageDialog(
                            this,
                            "圖片儲存成功！");

                } catch (Exception ex) {

                    ex.printStackTrace();

                    JOptionPane.showMessageDialog(
                            this,
                            "圖片儲存失敗！");
                }
            }
        }
    }

    public void stateChanged(ChangeEvent e) {

        if (originalImage == null)
            return;

        brightValue.setText(
                String.valueOf(
                        brightSlider.getValue()));

        contrastValue.setText(
                contrastSlider.getValue() + "%");

        adjustImage();
    }

    void adjustImage() {

        currentImage = copyImage(originalImage);

        int brightness = brightSlider.getValue();
        float contrast = contrastSlider.getValue() / 100f;

        for (int y = 0; y < currentImage.getHeight(); y++) {

            for (int x = 0; x < currentImage.getWidth(); x++) {

                Color c = new Color(currentImage.getRGB(x, y));

                int r = (int) (c.getRed() * contrast + brightness);
                int g = (int) (c.getGreen() * contrast + brightness);
                int b = (int) (c.getBlue() * contrast + brightness);

                r = Math.max(0, Math.min(255, r));
                g = Math.max(0, Math.min(255, g));
                b = Math.max(0, Math.min(255, b));

                currentImage.setRGB(x, y, new Color(r, g, b).getRGB());
            }
        }

        showImage(currentImage);
    }

    void grayFilter() {

        for (int y = 0; y < currentImage.getHeight(); y++) {

            for (int x = 0; x < currentImage.getWidth(); x++) {

                Color c = new Color(currentImage.getRGB(x, y));

                int gray = (c.getRed() + c.getGreen() + c.getBlue()) / 3;

                currentImage.setRGB(x, y,
                        new Color(gray, gray, gray).getRGB());
            }
        }

        showImage(currentImage);
    }

    void blurFilter() {

        BufferedImage temp = copyImage(currentImage);

        for (int y = 1; y < currentImage.getHeight() - 1; y++) {

            for (int x = 1; x < currentImage.getWidth() - 1; x++) {

                int sumR = 0;
                int sumG = 0;
                int sumB = 0;

                for (int j = -1; j <= 1; j++) {

                    for (int i = -1; i <= 1; i++) {

                        Color c = new Color(temp.getRGB(x + i, y + j));

                        sumR += c.getRed();
                        sumG += c.getGreen();
                        sumB += c.getBlue();
                    }
                }

                currentImage.setRGB(x, y,
                        new Color(sumR / 9, sumG / 9, sumB / 9).getRGB());
            }
        }

        showImage(currentImage);
    }

    void edgeFilter() {

        BufferedImage temp = copyImage(currentImage);

        for (int y = 1; y < currentImage.getHeight() - 1; y++) {

            for (int x = 1; x < currentImage.getWidth() - 1; x++) {

                Color c1 = new Color(temp.getRGB(x, y));
                Color c2 = new Color(temp.getRGB(x + 1, y));

                int diff = Math.abs(c1.getRed() - c2.getRed());

                if (diff > 30)
                    currentImage.setRGB(x, y, Color.BLACK.getRGB());
                else
                    currentImage.setRGB(x, y, Color.WHITE.getRGB());
            }
        }

        showImage(currentImage);
    }

    void showImage(BufferedImage img) {

        ImageIcon icon = new ImageIcon(img.getScaledInstance(
                600, 400, Image.SCALE_SMOOTH));

        imageLabel.setIcon(icon);
    }

    BufferedImage copyImage(BufferedImage img) {

        BufferedImage copy = new BufferedImage(
                img.getWidth(),
                img.getHeight(),
                BufferedImage.TYPE_INT_RGB);

        Graphics g = copy.getGraphics();
        g.drawImage(img, 0, 0, null);
        g.dispose();

        return copy;
    }

    public static void main(String[] args) {
        new MyFilterApp();
    }
}
